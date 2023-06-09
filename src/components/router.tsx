import { AuthService, DatabaseService, FireEnjin } from '@fireenjin/sdk';
import { Build, Component, ComponentInterface, Listen, h } from '@stencil/core';
import { initializeApp } from 'firebase/app';
import env from '../helpers/env';
import state from '../store';
import pick from '../helpers/pick';
import { modalController } from '@ionic/core';
import UserModel from '../models/user';
import { User } from '../interfaces';
@Component({
  tag: 'app-router',
})
export class AppRouter implements ComponentInterface {
  modal: HTMLIonModalElement;
  app = Build.isBrowser ? initializeApp(env('firebase')) : null;
  auth = Build.isBrowser
    ? new AuthService({
        app: this.app,
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
            url: 'https://chat-app-167c0.web.app/',
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

  @Listen('fireenjinTrigger', { target: 'document' })
  async onTrigger(event) {
    const triggerName = event?.detail?.name;
    const payload = event?.detail?.payload;
    if (triggerName === 'chatMessage') {
      await this.db?.add(payload?.collectionName, payload?.data);
    }
  }

  @Listen('chatModalOpen', { target: 'document' })
  async presentModal(event: CustomEvent) {
    this.modal = await modalController.create({
      component: event?.detail?.component,
      componentProps: { db: this.db, ...(event?.detail?.componentProps || {}) },
      cssClass: event?.detail?.cssClass,
    });
    await this.modal.present();
  }

  @Listen('chatModalClose', { target: 'document' })
  async closeModal() {
    this.modal.dismiss();
  }

  async getProfile() {
    state.profile = (await new UserModel(this.db).find(state?.session?.uid)) || ([] as User);
  }

  componentWillLoad() {
    this.auth.onAuthChanged(async session => {
      state.session = session;
      this.getProfile();
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
          // const routerEl = document.querySelector('ion-router');
          // if (!routerEl) return;
          // routerEl.push('/chat');
        } catch {
          console.log('User document already exists');
        }

        // if (Build.isBrowser && ['/'].includes(window?.location?.pathname)) {
        //   setTimeout(() => {
        //     const routerEl = document.querySelector('ion-router');
        //     if (routerEl?.push) routerEl.push('/chat');
        //   }, 200);
        // }
      }
    });
  }

  render() {
    return [
      <ion-router useHash={false}>
        <ion-route url="/" component="page-home" componentProps={this.componentProps} />
        <ion-route url="/chat" component="page-chat-list" />
        <ion-route url="/chat/:roomId" component="page-chat" />
      </ion-router>,
      <chat-app />,
    ];
  }
}
