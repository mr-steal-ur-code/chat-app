import { Component, EventEmitter, Fragment, Prop, h, Event, Build, Listen } from '@stencil/core';
import { Message } from '../../../interfaces';
import { DatabaseService, FireEnjinFetchEvent, FireEnjinTriggerInput } from '@fireenjin/sdk';
import state from '../../../store';

@Component({
  tag: 'page-chat',
  styleUrl: 'page-chat.css',
})
export class PageChat {
  routerEl = document?.querySelector('ion-router');
  inputEl: HTMLInputElement;
  containerEl: HTMLElement;

  @Event() chatPopoverOpen: EventEmitter;
  @Event() chatPopoverClose: EventEmitter;
  @Event() fireenjinTrigger: EventEmitter<FireEnjinTriggerInput>;
  @Event() fireenjinFetch: EventEmitter<FireEnjinFetchEvent>;

  @Prop() db: DatabaseService;
  @Prop({ mutable: true }) messages: Message[];
  @Prop() roomId: string;

  @Listen('fireenjinSuccess')
  onSuccess(event) {
    if (event?.detail?.name === 'getMessages') {
      const messages = event?.detail?.data || [];
      this.messages = messages?.sort?.((a, b) => {
        var dateA = new Date(a?.createdAt?.toDate());
        var dateB = new Date(b?.createdAt?.toDate());
        return dateA < dateB ? 1 : -1;
      });
      setTimeout(() => {
        this.scrollToBottom();
      }, 50);
    }
  }

  async componentDidLoad() {
    if (!Build?.isBrowser) return;
    this.routerEl?.addEventListener('ionRouteDidChange', () => {
      this.containerEl?.scrollTo(0, this.containerEl?.scrollHeight);
    });
    this.fireenjinTrigger.emit({
      name: 'subscribe',
      payload: {
        collection: `rooms/${this.roomId}/messages`,
        callback: () => {
          this.getMessages();
        },
      },
    });
  }

  disconnectedCallback() {
    if (this.routerEl) {
      this.routerEl?.removeEventListener('ionRouteDidChange', () => {
        console.log('Listener Removed');
      });
    }
    this.fireenjinTrigger.emit({
      name: 'unsubscribe',
      payload: {
        collection: `rooms/${this.roomId}/messages`,
      },
    });
  }

  openPopoverOptions(event,id: string, roomId: string) {
    this.chatPopoverOpen.emit({
      event,
      component: 'popover-chat-options',
      componentProps: {
        id,
        roomId,
      },
    });
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

  getMessages() {
    this.fireenjinFetch.emit({
      name: 'getMessages',
      endpoint: `rooms/${this.roomId}/messages`,
    });
  }

  scrollToBottom() {
    this.containerEl?.scrollTo({ top: this.containerEl?.scrollHeight, behavior: 'smooth' });
    // this.containerEl?.scrollTo(0, this.containerEl?.scrollHeight);
    //   console.log('messages:', this.messages);
  }

  render() {
    return (
      <Fragment>
        <section class="msger">
          <main ref={el => (this.containerEl = el)} class="msger-chat">
            {Object.entries?.(this.messages || [])
              ?.reverse()
              ?.map(([_i, message]) => (
                <div>
                  <div class="msg">
                    {/* loop profile icon here */}
                    <div class="msg-img" style={{ 'background-image': 'url(https://www.lifespan.io/wp-content/uploads/2020/02/smiley.jpg)' }}></div>

                    <div class="msg-bubble">
                      <div class="msg-info">
                        <div class="msg-info-name">{message?.createdBy || 'no username'}</div>
                        <div class="msg-info-time">{new Date(message?.createdAt?.seconds * 1000)?.toISOString()?.slice(11, 16)}</div>
                      </div>
                      {/* loop messages here */}
                      <div class="msg-text">{message?.text}</div>
                    </div>
                    <ion-button onClick={(event) => this.openPopoverOptions(event,message?.id, this.roomId)} fill="clear">
                      <ion-icon slot="icon-only" color="secondary" name="ellipsis-vertical-circle" />
                    </ion-button>
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
