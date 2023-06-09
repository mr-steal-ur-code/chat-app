import { popoverController } from '@ionic/core';
import { Build, Component, ComponentInterface, EventEmitter, h, Listen, Event, Prop } from '@stencil/core';
import state from '../../../store';
import { DatabaseService, FireEnjinFetchEvent } from '@fireenjin/sdk';
import { User } from '../../../interfaces';

@Component({
  tag: 'page-profile',
  // shadow: true,
})
export class PageProfile implements ComponentInterface {
  popoverEl: HTMLIonPopoverElement;

  @Prop() user: User
  @Prop() db: DatabaseService

  @Event() fireenjinFetch: EventEmitter<FireEnjinFetchEvent>;

  @Listen('fireenjinReset', { target: 'body' })
  onReset() {
    this.popoverEl.dismiss();
  }
  @Listen('fireenjinSuccess', { target: 'body' })
  onSuccess(event) {
    if (event?.detail?.endpoint === 'users') {
      this.user = event?.detail?.data
    }
    if (event?.detail?.endpoint === 'users' && event?.detail?.name === 'editProfile') {
      this.popoverEl.dismiss();
    }
  }

  async openEditProfilePopover(event) {
    this.popoverEl = await popoverController.create({
      component: 'popover-edit-profile',
      componentProps: {
        user: this.user
      },
      event,
    });
    return this.popoverEl.present();
  }

  async findUser() {
    this.fireenjinFetch.emit({
      endpoint: 'users',
      name: 'findUser',
      params: {
        id: state?.profile?.id,
      }
    });
  }

  componentDidLoad() {
    if (!Build?.isBrowser) return;
    this.findUser();
  }

  render() {
    console.log(this.user, "user");
    return (
      <ion-item>
        <ion-text>{state?.profile?.userName}</ion-text>
        <ion-button
          fill="clear"
          onClick={event => this.openEditProfilePopover(event)}
          style={{ paddingLeft: '10px' }}>
          <ion-icon
            color="medium"
            slot="icon-only"
            name="create" />
        </ion-button>
      </ion-item>
    );
  }
}
