import { Component, h } from '@stencil/core';

@Component({
  tag: 'users-app',
  styleUrl: 'users-app.css',
})
export class usersApp {
  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Users</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content scroll-events>
        <h1>kaushdiuaeshdiu</h1>
        <h1>sldkopwhdiu</h1>
        <h1>kasdafwsdwehdiu</h1>
        <h1>kaushdiuaeshdiu</h1>
        <h1>sldkopwhdiu</h1>
        <h1>kasdafwsdwehdiu</h1>
      </ion-content>,
    ];
  }
}
