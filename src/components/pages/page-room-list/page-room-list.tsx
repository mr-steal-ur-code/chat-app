import { FireEnjinFetchEvent } from '@fireenjin/sdk';
import { Component, EventEmitter, h, Event, Listen, Build, State } from '@stencil/core';
import { textRoom } from '../../../interfaces';

@Component({
  tag: 'page-room-list',
  styleUrl: 'page-room-list.css',
})
export class PageRoomList {
  @Event() fireenjinFetch: EventEmitter<FireEnjinFetchEvent>;

  @State() rooms: textRoom[];

  @Listen('fireenjinSuccess')
  onSuccess(event) {
    if (event?.detail?.endpoint === 'rooms') this.rooms = event?.detail?.data;
  }

  // joinVoice(roomId) {
  //   const routerEl = document.querySelector('ion-router');
  //   if (routerEl) routerEl.push(`/voice/${roomId}`);
  // }

  joinText(roomId) {
    const routerEl = document.querySelector('ion-router');
    if (routerEl) routerEl.push(`/chat/${roomId}`);
  }

  fetchRooms() {
    this.fireenjinFetch.emit({
      endpoint: 'rooms',
    });
  }

  componentDidLoad() {
    if (!Build?.isBrowser) return;
    this.fetchRooms();
  }

  render() {
    return (
      <ion-accordion-group multiple="true" value={['voice', 'text']}>
        <ion-accordion value="voice" toggleIconSlot="start">
          <ion-item color="secondary" slot="header">
            <ion-label>Voice Rooms</ion-label>
          </ion-item>
          {Object.entries(this.rooms || [])
            ?.filter(([_i, room]) => room?.type === 'voice')
            ?.map(([_i, room]) => (
              <div slot="content">
                <ion-item
                // onClick={() => this.joinVoice(room?.id)} button={true}
                >
                  {room?.name || 'uh oh! no name'}
                </ion-item>
              </div>
            ))}
        </ion-accordion>
        <ion-accordion value="text" toggleIconSlot="start" style={{ marginTop: '50px' }}>
          <ion-item color="secondary" slot="header">
            <ion-label>Text Rooms</ion-label>
          </ion-item>
          {Object.entries(this.rooms || [])
            ?.filter(([_i, room]) => room?.type === 'text')
            ?.map(([_i, room]) => (
              <div slot="content">
                <ion-item onClick={() => this.joinText(room?.id)} button={true}>
                  {room?.name || 'uh oh! no name'}
                </ion-item>
              </div>
            ))}
        </ion-accordion>
      </ion-accordion-group>
    );
  }
}
