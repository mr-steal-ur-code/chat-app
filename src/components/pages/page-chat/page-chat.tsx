import { Component, h } from '@stencil/core';

@Component({
  tag: 'page-chat',
  styleUrl: 'page-chat.css',
})
export class PageChat {
  render() {
    return (
      <div>
        <fireenjin-form endpoint="messages" name="sendMessage">
          <fireenjin-input name="message" label="test" labelPosition="stacked" />
        </fireenjin-form>
        <ion-icon name="trash" />
      </div>
    );
  }
}
