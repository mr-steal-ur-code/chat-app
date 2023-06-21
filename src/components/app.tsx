import { Component, EventEmitter, h, Event } from '@stencil/core';

@Component({
  tag: 'chat-app',
})
export class chatApp {
  @Event() forceUpdate: EventEmitter;
  render() {
    return (
      <ion-app>
        <ion-split-pane when={window?.screen?.availWidth > 920 ? true : false} content-id="app-content">
          <ion-router-outlet id="app-content"></ion-router-outlet>
          <ion-menu content-id="app-content" side="start">
            <ion-header>
              <ion-toolbar color="primary">
                <ion-title style={{ paddingLeft: '1rem' }}>Chat App</ion-title>
              <ion-button
                title="Check for updates"
                slot="start"
                fill="clear"
                onClick={() => this.forceUpdate.emit({})}
              >
                <ion-icon color="secondary" slot="icon-only" name="refresh-circle"/>
              </ion-button>
              </ion-toolbar>
            </ion-header>
            <ion-content scroll-events>
              <item-profile />
              <item-create-room />
              <page-room-list />
            </ion-content>
          </ion-menu>
        </ion-split-pane>
      </ion-app>
    );
  }
}
