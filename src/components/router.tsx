import { AuthService, DatabaseService, FireEnjin } from '@fireenjin/sdk';
import { Build, Component, ComponentInterface, Listen, h } from '@stencil/core';
import { initializeApp } from 'firebase/app';
import { getIdTokenResult } from '@firebase/auth';
import env from '../helpers/env';
import state from '../store';
import pick from '../helpers/pick';
import { modalController, popoverController, toastController } from '@ionic/core';
import getCache from '../helpers/getCache';
import clearCache from '../helpers/clearCache';
@Component({
  tag: 'app-router',
})
export class AppRouter implements ComponentInterface {
  routerEl = document.querySelector('ion-router');
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

  @Listen("forceUpdate", { target: "window" })
  async onForceUpdate() {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister()));
    (window.location as any).reload(true);
  }

  @Listen("swUpdate", { target: 'window' })
async onServiceWorkerUpdate() {
  const registration = await navigator.serviceWorker.getRegistration();

  const toast = await toastController.create({
    message: "New version available.",
    buttons: [{ text: 'Reload', role: 'reload' }],
    duration: 0
  });

  await toast.present();

  const { role } = await toast.onWillDismiss();

  if (role === 'reload') {
    registration.waiting.postMessage("skipWaiting");
  }
}

  @Listen('fireenjinSuccess', { target: 'document' })
  async onSuccess({ detail }) {
    const data = detail?.data || {};
    const id = data?.id;
    this.popover?.dismiss();
    if (detail?.name === 'addRoom') {
      this.db?.update('rooms', id, { id: id, createdAt: new Date() });
    } else if (detail?.name === 'editProfile') {
      this.db?.update('users', id, { updatedAt: new Date() });
    }
  }

  @Listen('fireenjinTrigger', { target: 'document' })
  async onTrigger(event) {
    const triggerName = event?.detail?.name;
    const payload = event?.detail?.payload;
    if (triggerName === 'deleteChat') {
      await this.db.delete(payload?.path, payload?.id);
    } else if (triggerName === 'chatMessage') {
      await this.db?.add(payload?.collectionName, payload?.data);
    } else if (triggerName === 'subscribe') {
      await this.db.subscribe(
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
      await this.db.clearWatchers();
      await clearCache();
      this.presentToast();
      window.location.href = '/';
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

  async setUserClaims(session) {
    const token = await getIdTokenResult(session, true);
    state.claims = session?.uid
      ? (pick(token.claims, ['admin', 'tester', 'role']) as {
          admin: boolean;
          tester: boolean;
          role: string;
        })
      : {};
  }

  async componentWillLoad() {
    if (!Build?.isBrowser) return;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistration()
          .then(registration => {
            if (registration?.active) {
              navigator.serviceWorker.addEventListener(
                'controllerchange',
                () => window.location.reload()
              );
            }
          })
      }
    
    state.claims = (await getCache('chatApp:claims')) || {};
    this.auth.onAuthChanged(async session => {
      state.session = session;
      if (session && session?.uid) {
        try {
          const data = { id: session?.uid, email: session?.email };
          await this.db.add('users', data, session.uid);
        } catch {
          console.log('User document already exists');
        }
        this.setUserClaims(session);
        state.profile = (await getCache('chatApp:profile')) || null;
        if (Build?.isBrowser && ['/'].includes(window?.location?.pathname)) {
          setTimeout(() => {
            window?.location?.assign('/chat');
          }, 200);
        }
      }
      setTimeout(async () => {
        try {
          state.users = (await getCache('chatApp:users')) || {};
        } catch (e) {
          console.log('Error setting users cache', e);
        }
      });
      if (typeof session?.uid !== 'string') return;
      this.db.watchDocument('users', session.uid, async snapshot => {
        if (snapshot?.data?.forceUpdate) {
          await this.db.update('users', session?.uid, {
            updatedAt: new Date(),
            forceUpdate: false,
          });
        }
        state.profile = snapshot?.data || {
          id: session?.uid,
        };
        setTimeout(() => {
          this.setUserClaims(session);
        }, 5000);
      });
    });
  }

  @Listen('ionRouteDidChange')
  async onRouteDidChange(event) {
    let stopLoader = true;
    if (!Build.isBrowser) return false;
    if (state?.session && state?.session?.uid) {
      if (Build?.isBrowser && ['/'].includes(window?.location?.pathname)) {
        setTimeout(() => {
          if (this.routerEl) this.routerEl.push('/chat');
        }, 200);
      }
    }
    if (!state?.session?.uid && ['/chat'].indexOf(event.detail.to) >= 0) {
      stopLoader = false;
      if (this.routerEl) this.routerEl.push('/');
    }
    if (stopLoader) {
      document.body.classList.add('is-loaded');
    }
  }

  render() {
    console.log(Notification.permission)
    return [
      <ion-router useHash={false}>
        <ion-route url="/" component="page-login" componentProps={this.componentProps} />
        <ion-route url="/chat" component="page-chat-list" />
        <ion-route url="/chat/:roomId" component="page-chat" componentProps={this.componentProps} />
      </ion-router>,
      <chat-app />,
    ];
  }
}
