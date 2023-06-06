import { Component, h } from '@stencil/core';

@Component({
  tag: 'page-chat-list',
  styleUrl: 'page-chat-list.css',
})
export class PageChatList {
  render() {
    return (
      <div>
        <fireenjin-form endpoint="messages" name="sendMessage">
          <fireenjin-input name="message" label="test" labelPosition="stacked" />
        </fireenjin-form>
      </div>
    );
  }
}
