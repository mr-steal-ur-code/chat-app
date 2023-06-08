import { Component, EventEmitter, Fragment, h, State, Event, Prop } from '@stencil/core';
import state from '../../../store';
import { toastController } from '@ionic/core';
import { AuthService, DatabaseService } from '@fireenjin/sdk';

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.css',
  // shadow: true,
})
export class PageHome {
  @Event() chatModalOpen: EventEmitter;

  @Prop() db: DatabaseService;
  @Prop() auth: AuthService;

  @State() mode: string;

  async googleLogin() {
    await this.auth?.withSocial('google');
  }

  async logout() {
    this.auth?.logout();
    this.presentToast();
    setTimeout(() => window.location.reload(), 3000);
  }
  async presentToast() {
    const toast = await toastController.create({
      message: 'You have been logged out',
      duration: 3000,
    });
    toast.present();
  }

  render() {
    return (
      <Fragment>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Home</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '500px', height: '400px', background: '#330606' }}>
              {!state?.session?.uid && (
                <ion-button style={{ textTransform: 'capitalize' }} size="small" onClick={() => this.googleLogin()}>
                  Sign in with Google
                </ion-button>
              )}
              {state.session?.uid && (
                <ion-button style={{ textTransform: 'capitalize' }} size="small" onClick={() => this.logout()}>
                  Logout
                </ion-button>
              )}
              {state.session?.uid ? (
                <ion-button
                  style={{ textTransform: 'capitalize' }}
                  size="small"
                  onClick={() =>
                    this.chatModalOpen.emit({
                      component: 'modal-profile',
                      componentProps: {
                        auth: this.auth,
                        userId: state?.session?.uid,
                      },
                    })
                  }
                >
                  Edit
                  <ion-icon style={{ height: '15px' }} name="person" color="light" />
                </ion-button>
              ) : (
                <ion-button
                  size="small"
                  style={{ textTransform: 'capitalize' }}
                  onClick={() =>
                    this.chatModalOpen.emit({
                      component: 'modal-login',
                      componentProps: {
                        auth: this.auth,
                      },
                    })
                  }
                >
                  Sign in with email link
                </ion-button>
              )}
            </div>
          </div>
        </ion-content>
      </Fragment>
    );
  }
}
