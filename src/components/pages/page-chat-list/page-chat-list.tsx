import { Component, EventEmitter, h,Event } from '@stencil/core';

@Component({
  tag: 'page-chat-list',
  styleUrl: 'page-chat-list.css',
})
export class PageChatList {
  @Event() forceUpdate: EventEmitter;
  render() {
    return <div>
      <h1>This page is blank 🤷‍♂️</h1>
    </div>;
  }
}
