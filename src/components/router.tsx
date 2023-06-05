import { AuthService, DatabaseService, FireEnjin } from '@fireenjin/sdk';
import { Build, Component, ComponentInterface, Listen, h } from '@stencil/core';
import { initializeApp } from 'firebase/app';
import env from '../helpers/env';
import state from '../global/store';
import pick from '../helpers/pick';
import { modalController } from '@ionic/core';
@Component({
  tag: 'app-router',
})
export class AppRouter implements ComponentInterface {
  app = Build.isBrowser ? initializeApp(env('firebase')) : null;
  auth = Build.isBrowser
    ? new AuthService({
        app: this.app,
        config: {
          tokenLocalStorageKey: 'madnessdev:token',
          authLocalStorageKey: 'madnessdev:session',
          emulate: false,
        },
      })
    : null;
  db = Build.isBrowser
    ? new DatabaseService({
        app: this.app,
        emulate: false,
      })
    : null;
  fireenjin = Build.isBrowser
    ? new FireEnjin({
        debug: true,
        connections: [
          {
            db: this.db,
            type: 'firebase',
            url: 'https://deadbydaylight.group/api',
          },
        ],
      })
    : null;
  componentProps = {
    app: this.app,
    auth: this.auth,
    db: this.db,
    fireenjin: this.fireenjin,
  };
  modal: HTMLIonModalElement;

  @Listen('chatModalOpen', { target: 'document' })
  async presentModal(event: CustomEvent) {
    this.modal = await modalController.create({
      component: event?.detail?.component,
      componentProps: { db: this.db, ...(event?.detail?.componentProps || {}) },
      cssClass: event?.detail?.cssClass,
    });
    await this.modal.present();
  }

  @Listen('pbModalClose', { target: 'document' })
  async closeModal() {
    this.modal.dismiss();
  }

  componentWillLoad() {
    this.auth.onAuthChanged(async session => {
      state.session = session;
      state.claims = session?.uid
        ? (pick(await this.auth.getClaims(), ['admin', 'tester', 'role']) as {
            admin: boolean;
            tester: boolean;
            role: string;
          })
        : {};
      // IF LOGGED IN
      if (session?.uid) {
        try {
          const data = { id: session?.uid, email: session?.email };
          await this.db.add('users', data, session.uid);
        } catch {
          console.log('User document already exists');
        }
      }
    });
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url="/" component="page-home" componentProps={this.componentProps} />
          <ion-route url="/chat" component="page-chat-list"></ion-route>
          <ion-route url="/chat/:chatId" component="page-chat"></ion-route>
        </ion-router>
        <ion-nav></ion-nav>
      </ion-app>
    );
  }
}
