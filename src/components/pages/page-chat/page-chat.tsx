import { Component, Fragment, Prop, h } from '@stencil/core';
import { Message } from '../../../interfaces';
import { DatabaseService } from '@fireenjin/sdk';

@Component({
  tag: 'page-chat',
  styleUrl: 'page-chat.css',
})
export class PageChat {
  @Prop() db: DatabaseService;
  @Prop() messages: Message[];

  async componentDidLoad() {
    this.db.subscribe({ collectionName: 'messages' }, ({ docs }) => {
      this.messages = (docs || []).map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  }

  render() {
    return (
      <Fragment>
        {/* {Object.entries(this.messages)?.map(message => ( */}
        <section class="msger">
          <main class="msger-chat">
            <div class="msg">
              {/* loop profile icon here */}
              <div class="msg-img" style={{ 'background-image': 'url(https://image.flaticon.com/icons/svg/327/327779.svg)' }}></div>

              <div class="msg-bubble">
                <div class="msg-info">
                  <div class="msg-info-name">user</div>
                  <div class="msg-info-time">12:45</div>
                </div>
                {/* loop messages here */}
                <div class="msg-text">message from somebody</div>
              </div>
            </div>
          </main>

          <form class="msger-inputarea">
            <input type="text" class="msger-input" placeholder="Enter your message..." />
            <button type="submit" class="msger-send-btn">
              Send
            </button>
          </form>
        </section>
        {/* ))} */}
      </Fragment>
    );
  }
}
