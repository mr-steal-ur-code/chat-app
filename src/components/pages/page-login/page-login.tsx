import { Component, EventEmitter, Fragment, h, State, Event, Prop } from '@stencil/core';
import state from '../../../store';
import { AuthService, DatabaseService } from '@fireenjin/sdk';

@Component({
  tag: 'page-login',
  // shadow: true,
})
export class PageHome {
  routerEl = document?.querySelector('ion-router');

  @Event() chatPopoverOpen: EventEmitter;

  @Prop() db: DatabaseService;
  @Prop() auth: AuthService;

  @State() mode: string;

  async googleLogin() {
    await this.auth?.withSocial('google');
  }

  redirect() {
    window?.location?.assign('/chat');
  }

  render() {
    return (
      <Fragment>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Login</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          {!state?.session?.uid ? (
            <span style={{ display: 'flex', gap: '3rem' }}>
              <ion-button style={{ textTransform: 'capitalize' }} size="small" onClick={() => this.googleLogin()}>
                Sign in with Google
              </ion-button>
              <ion-button
                size="small"
                style={{ textTransform: 'capitalize' }}
                onClick={() =>
                  this.chatPopoverOpen.emit({
                    component: 'popover-login-with-email',
                    componentProps: {
                      auth: this.auth,
                    },
                  })
                }
              >
                Sign in with email link
              </ion-button>
            </span>
          ) : (
            <div>
              <h3>Logged in, redirecting</h3>
              <ion-button style={{ textTransform: 'capitalize' }} onClick={() => this.redirect()}>
                Redirect Myself
              </ion-button>
            </div>
          )}
        </ion-content>
      </Fragment>
    );
  }
}
