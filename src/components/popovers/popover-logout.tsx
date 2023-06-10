import { FireEnjinTriggerInput } from '@fireenjin/sdk';
import { Component, EventEmitter, h, Event } from '@stencil/core';

@Component({
  tag: 'popover-logout',
})
export class PopoverLogout {
  @Event() fireenjinTrigger: EventEmitter<FireEnjinTriggerInput>;

  render() {
    return (
      <ion-button
        expand="block"
        onClick={() =>
          this.fireenjinTrigger.emit({
            name: 'logout',
          })
        }
      >
        Logout
      </ion-button>
    );
  }
}
