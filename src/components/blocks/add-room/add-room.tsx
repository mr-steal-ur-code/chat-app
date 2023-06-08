import { popoverController } from '@ionic/core';
import { Component, ComponentInterface, Listen, h } from '@stencil/core';

@Component({
  tag: 'add-room',
})
export class AddRoom implements ComponentInterface {
  popoverEl: HTMLIonPopoverElement;

  @Listen('fireenjinReset', { target: 'body' })
  onReset() {
    this.popoverEl.dismiss();
  }
  @Listen('fireenjinSubmit', { target: 'body' })
  onSubmit(event) {
    if (event?.detail?.endpoint === 'rooms') {
      this.popoverEl.dismiss();
    }
  }

  async openAddRoomPopover(event) {
    this.popoverEl = await popoverController.create({
      component: 'popover-add-room',
      event,
    });
    return this.popoverEl.present();
  }

  render() {
    return (
      <ion-item>
        <ion-text>Create Room</ion-text>
        <ion-button onClick={event => this.openAddRoomPopover(event)} style={{ paddingLeft: '10px' }}>
          <ion-icon slot="icon-only" name="add-circle"></ion-icon>
        </ion-button>
      </ion-item>
    );
  }
}
