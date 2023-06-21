import { FireEnjinTriggerInput } from '@fireenjin/sdk';
import { Component, EventEmitter, h, Event, Prop } from '@stencil/core';

@Component({
  tag: 'popover-chat-options',
})
export class PopoverLogout {
  @Event() fireenjinTrigger: EventEmitter<FireEnjinTriggerInput>;
  @Prop() messageId: string;
  @Prop() roomId: string;

  render() {
    return (
      <ion-button
        fill="clear"
        onClick={() =>
          this.fireenjinTrigger.emit({
            name: 'deleteChat',
            payload: {
              path: `rooms/${this.roomId}/messages`,
              id: this.messageId,
            },
          })
        }
      >
        <ion-icon color="danger" slot="icon-only" name="trash" />
      </ion-button>
    );
  }
}
