import { Component, EventEmitter, h,Event } from '@stencil/core';

@Component({
  tag: 'page-chat-list',
  styleUrl: 'page-chat-list.css',
})
export class PageChatList {
  @Event() forceUpdate: EventEmitter;
  render() {
    return <div>
      <ion-button
                title="Check for updates"
                slot="start"
                fill="clear"
                onClick={() => this.forceUpdate.emit({})}
              >
                <ion-icon color="primary" slot="icon-only" name="refresh-circle"/>
              </ion-button>
    </div>;
  }
}
