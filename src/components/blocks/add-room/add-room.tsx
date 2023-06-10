import { popoverController } from '@ionic/core';
import { Component, ComponentInterface, EventEmitter, Listen, h, Event } from '@stencil/core';

@Component({
  tag: 'add-room',
})
export class AddRoom implements ComponentInterface {
  popoverEl: HTMLIonPopoverElement;

  @Event() chatPopoverClose: EventEmitter;
  @Event() chatPopoverOpen: EventEmitter;

  @Listen('fireenjinReset', { target: 'body' })
  onReset() {
    this.chatPopoverClose.emit();
  }
  @Listen('fireenjinSuccess', { target: 'body' })
  onSuccess(event) {
    if (event?.detail?.endpoint === 'rooms' && event?.detail?.name === 'addRoom') {
      this.chatPopoverClose.emit();
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
        <ion-button fill="clear" onClick={event => this.openAddRoomPopover(event)} style={{ paddingLeft: '10px' }}>
          <ion-icon color="medium" slot="icon-only" name="add-circle"></ion-icon>
        </ion-button>
      </ion-item>
    );
  }
}
