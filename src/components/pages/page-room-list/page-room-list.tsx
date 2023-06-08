import { FireEnjinFetchEvent } from '@fireenjin/sdk';
import { Component, EventEmitter, h, Event, Listen, Prop, Build } from '@stencil/core';
import { Room } from '../../../interfaces';

@Component({
  tag: 'page-room-list',
  styleUrl: 'page-room-list.css',
})
export class PageRoomList {
  @Event() fireenjinFetch: EventEmitter<FireEnjinFetchEvent>;

  @Prop() rooms: Room[];

  @Listen('fireenjinSuccess')
  onSuccess(event) {
    if (event?.detail?.endpoint === 'rooms') this.rooms = event?.detail?.data;
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
    console.log(this.rooms);

    return (
      <ion-accordion-group multiple="true">
        <ion-accordion>
          <ion-item color="secondary" slot="header">
            <ion-label>Voice Rooms</ion-label>
          </ion-item>
          {Object.entries(this.rooms || [])
            ?.filter(([_i, room]) => room?.type === 'voice')
            ?.map(([_i, room]) => (
              <div slot="content">
                <ion-item button="true">{room?.name || 'uh oh! no name'}</ion-item>
              </div>
            ))}
        </ion-accordion>
        <ion-accordion style={{ marginTop: '50px' }}>
          <ion-item color="secondary" slot="header">
            <ion-label>Text Rooms</ion-label>
          </ion-item>
          {Object.entries(this.rooms || [])
            ?.filter(([_i, room]) => room?.type === 'text')
            ?.map(([_i, room]) => (
              <div slot="content">
                <ion-item button="true">{room?.name || 'uh oh! no name'}</ion-item>
              </div>
            ))}
        </ion-accordion>
      </ion-accordion-group>
    );
  }
}
