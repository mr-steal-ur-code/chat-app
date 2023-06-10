import { Build, Component, ComponentInterface, EventEmitter, h, Listen, Event, Prop } from '@stencil/core';
import state from '../../../store';
import { AuthService, DatabaseService, FireEnjinFetchEvent } from '@fireenjin/sdk';
import { User } from '../../../interfaces';

@Component({
  tag: 'item-profile',
  // shadow: true,
})
export class ItemProfile implements ComponentInterface {
  @Event() chatPopoverOpen: EventEmitter;
  @Event() chatPopoverClose: EventEmitter;

  @Prop() user: User;
  @Prop() db: DatabaseService;
  @Prop() auth: AuthService;

  @Event() fireenjinFetch: EventEmitter<FireEnjinFetchEvent>;

  @Listen('fireenjinSuccess', { target: 'body' })
  onSuccess(event) {
    if (event?.detail?.endpoint === 'users') {
      this.user = event?.detail?.data || {};
      this.chatPopoverClose.emit();
    }
  }

  async findUser(id: string) {
    this.fireenjinFetch.emit({
      endpoint: 'users',
      name: 'findUser',
      params: {
        id,
      },
    });
    // const data = await this.db.find?.('users', id);
    // state.users = { ...(state?.users || {}), [id]: data };
    // await setCache('chatApp:users', state.users);
    // if (!data) return null;
  }

  async componentDidLoad() {
    if (!Build?.isBrowser) return;
    setTimeout(() => {
      this.findUser(state?.session?.uid);
    }, 500);
  }

  render() {
    return (
      <ion-item>
        <ion-text>{state?.profile?.userName || state?.profile?.firstName || state?.profile?.lastName}</ion-text>
        {state?.session?.uid ? (
          <ion-button
            fill="clear"
            onClick={() =>
              this.chatPopoverOpen.emit({
                component: 'popover-edit-profile',
                componentProps: {
                  user: this.user,
                },
              })
            }
          >
            <ion-icon color="medium" slot="icon-only" name="create" />
          </ion-button>
        ) : (
          <ion-button href={'/'}>login</ion-button>
        )}
        {state.session?.uid && (
          <ion-button
            fill="clear"
            onClick={() =>
              this.chatPopoverOpen.emit({
                component: 'popover-logout',
              })
            }
          >
            <ion-icon color="medium" slot="icon-only" name="log-out" />
          </ion-button>
        )}
      </ion-item>
    );
  }
}
