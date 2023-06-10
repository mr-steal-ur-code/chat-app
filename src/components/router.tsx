import { AuthService, DatabaseService, FireEnjin } from '@fireenjin/sdk';
import { Build, Component, ComponentInterface, Listen, h } from '@stencil/core';
import { initializeApp } from 'firebase/app';
import env from '../helpers/env';
import state from '../store';
import pick from '../helpers/pick';
import { modalController, popoverController, toastController } from '@ionic/core';
import UserModel from '../models/user';
import { User } from '../interfaces';
import getCache from '../helpers/getCache';
@Component({
  tag: 'app-router',
})
export class AppRouter implements ComponentInterface {
  modal: HTMLIonModalElement;
  popover: HTMLIonPopoverElement;
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
    } else if (triggerName === 'subscribe') {
      this.db.subscribe(
        {
          collectionName: event?.detail?.payload?.collection,
          orderBy: 'createdAt:desc',
        },
        typeof event?.detail?.payload?.callback === 'function'
          ? event?.detail?.payload?.callback
          : ({ docs }) => {
              if (!event?.detail?.payload?.stateKey) return;
              state[event?.detail?.payload?.stateKey] = docs;
            },
      );
    } else if (triggerName === 'unsubscribe') {
      this.db.unsubscribe(event?.detail?.payload?.collection);
    } else if (event?.detail?.name === 'logout') {
      this.auth?.logout();
      this.presentToast();
      setTimeout(() => window.location.reload(), 2000);
    }
  }

  @Listen('chatModalOpen', { target: 'body' })
  async presentModal(event: CustomEvent) {
    this.modal = await modalController.create({
      component: event?.detail?.component,
      componentProps: { db: this.db, ...(event?.detail?.componentProps || {}) },
      cssClass: event?.detail?.cssClass,
    });
    await this.modal.present();
  }

  @Listen('chatModalClose', { target: 'body' })
  async closeModal() {
    this.modal.dismiss();
  }

  @Listen('chatPopoverOpen', { target: 'body' })
  async openPopover(event) {
    this.popover = await popoverController.create(event.detail);
    this.popover.present();
  }

  @Listen('chatPopoverClose', { target: 'body' })
  closePopover() {
    const popoverEls = document.querySelectorAll('ion-popover');
    if (popoverEls) {
      popoverEls.forEach(popoverEl => popoverEl.dismiss());
    }
  }

  async presentToast() {
    const toast = await toastController.create({
      message: 'You have been logged out',
      duration: 3000,
    });
    toast.present();
  }

  async getProfile() {
    state.profile = (await new UserModel(this.db).find(state?.session?.uid)) || ([] as User);
  }

  async componentWillLoad() {
    if (!Build?.isBrowser) return;
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
          state.profile = (await getCache('chatApp:profile')) || {};
          state.claims = (await getCache('chatApp:claims')) || {};
          const data = { id: session?.uid, email: session?.email };
          await this.db.add('users', data, session.uid);
        } catch {
          console.log('User document already exists');
        }
      }
    });
  }

  componentDidLoad() {
    setTimeout(() => {
      if (!state?.session?.uid) {
        const routerEl = document.querySelector('ion-router');
        if (!routerEl) return;
        routerEl.push('/');
      }
    }, 1100);
  }

  render() {
    return [
      <ion-router useHash={false}>
        <ion-route url="/" component="page-login" componentProps={this.componentProps} />
        <ion-route url="/chat" component="page-chat-list" />
        <ion-route url="/chat/:roomId" component="page-chat" />
      </ion-router>,
      <chat-app />,
    ];
  }
}
