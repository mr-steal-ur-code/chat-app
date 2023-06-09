import { Component, EventEmitter, Fragment, Prop, h, Event, Build, Listen } from '@stencil/core';
import { Message } from '../../../interfaces';
import { DatabaseService, FireEnjinFetchEvent, FireEnjinTriggerInput } from '@fireenjin/sdk';
import state from '../../../store';

@Component({
  tag: 'page-chat',
  styleUrl: 'page-chat.css',
})
export class PageChat {
  inputEl: HTMLInputElement;

  @Event() fireenjinTrigger: EventEmitter<FireEnjinTriggerInput>;
  @Event() fireenjinFetch: EventEmitter<FireEnjinFetchEvent>;

  @Prop() db: DatabaseService;
  @Prop({ mutable: true }) messages: Message[];
  @Prop() roomId: string;

  @Listen('fireenjinSuccess')
  onSuccess(event) {
    this.messages = event?.detail?.data || [];
    console.log(this.messages, 'messages');
  }

  sendMessage(event) {
    event?.preventDefault();
    this.fireenjinTrigger.emit({
      name: 'chatMessage',
      payload: {
        data: {
          text: event?.target?.form[0]?.value,
          createdBy: state.profile?.userName,
          createdAt: new Date(),
        } as any,
        collectionName: `rooms/${this.roomId}/messages`,
      },
    });
    this.inputEl.value = '';
  }

  componentDidLoad() {
    if (!Build?.isBrowser) return;
    this.fireenjinFetch.emit({
      endpoint: `rooms/${this.roomId}/messages`,
    });
  }

  // componentDidLoad() {
  //   if (!Build?.isBrowser) return;
  //   this.db?.subscribe?.(
  //     {
  //       collectionName: `rooms/${this.roomId}/messages`,
  //     },
  //     ({ docs }) => {
  //       this.messages = (docs || [])?.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //     },
  //   );
  //   console.log('messages:', this.messages);
  // }

  render() {
    return (
      <Fragment>
        <section class="msger">
          <main class="msger-chat">
            {Object.entries?.(this.messages || [])
              ?.reverse()
              ?.map(([_i, message]) => (
                <div>
                  <div class="msg">
                    {/* loop profile icon here */}
                    <div class="msg-img" style={{ 'background-image': 'url(https://image.flaticon.com/icons/svg/327/327779.svg)' }}></div>

                    <div class="msg-bubble">
                      <div class="msg-info">
                        <div class="msg-info-name">{message?.createdBy || 'no username'}</div>
                        <div class="msg-info-time">{new Date(message?.createdAt?.seconds * 1000).toISOString().slice(11, 16)}</div>
                      </div>
                      {/* loop messages here */}
                      <div class="msg-text">{message?.text}</div>
                    </div>
                  </div>
                </div>
              ))}
          </main>
          <form id="messageForm" class="msger-inputarea">
            <input ref={el => (this.inputEl = el)} type="text" class="msger-input" placeholder="Enter your message..." />
            <button onClick={event => this.sendMessage(event)} type="submit" class="msger-send-btn">
              Send
            </button>
          </form>
        </section>
      </Fragment>
    );
  }
}
