import { Component, h } from '@stencil/core';

@Component({
  tag: 'chat-app',
})
export class chatApp {
  render() {
    return (
      <ion-app>
        <ion-split-pane when={window?.screen?.availWidth > 920 ? true : false} content-id="app-content">
          <ion-router-outlet id="app-content"></ion-router-outlet>
          <ion-menu content-id="app-content" side="start">
            <ion-header>
              <ion-toolbar color="primary">
                <ion-title>Rooms</ion-title>
              </ion-toolbar>
            </ion-header>
            <ion-content scroll-events>
              <h1>kaushdiuaeshdiu</h1>
              <h1>sldkopwhdiu</h1>
              <h1>kasdafwsdwehdiu</h1>
            </ion-content>
          </ion-menu>
        </ion-split-pane>
      </ion-app>
    );
  }
}
