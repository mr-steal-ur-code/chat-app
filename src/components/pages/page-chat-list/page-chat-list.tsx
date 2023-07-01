import { FireEnjinTriggerInput } from '@fireenjin/sdk';
import { Component, EventEmitter, h,Event, Listen } from '@stencil/core';

@Component({
  tag: 'page-chat-list',
  styleUrl: 'page-chat-list.css',
})
export class PageChatList {
  @Event() forceUpdate: EventEmitter;
  @Event() fireenjinTrigger: EventEmitter<FireEnjinTriggerInput>;

  @Listen("fireenjinTrigger")
  onTrigger(event) {
    if (event?.detail?.name === "notification") {
      if (Notification.permission === "granted")
      console.log(Notification.permission);
      console.log("event",event);
      new Notification("test", {body: "Body Test"});
        }
  }

  componentDidLoad() {
    Notification.requestPermission();
  }

  render() {
    return <div>
      <h1>This page is blank 🤷‍♂️</h1>
      <div>adding crap to test service worker reload
        <img style={{width:"150px"}} src='./assets/icon/icon.png'/>
      </div>
      <div>
        <ion-button onClick={() => this.fireenjinTrigger.emit({name:"notification"})}>notification</ion-button>
      </div>
    </div>;
  }
}
