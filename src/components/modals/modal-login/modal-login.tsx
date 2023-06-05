import { AuthService } from '@fireenjin/sdk';
import { Component, EventEmitter, h, Prop, Event, Listen, State, ComponentInterface } from '@stencil/core';
import env from '../../../helpers/env';
import { toastController } from '@ionic/core';

@Component({
  tag: 'modal-login',
  styleUrl: 'modal-login.css',
})
export class ModalLogin implements ComponentInterface {
  @State() formData: {
    name?: string;
    email?: string;
  } = {};

  @Prop() auth: AuthService;

  @Listen('ionInput')
  onInput(event) {
    this.formData[event.target.name] = event.target.value;
  }

  @Listen('fireenjinSubmit')
  async onSubmit() {
    let res;
    if (true === true) {
      res = await this.auth.withEmailLink(this.formData?.email, {
        url: env('url'),
        dynamicLinkDomain: env('dynamicLinkDomain'),
        handleCodeInApp: true,
      });
    }
    console.log(res);
    this.chatModalClose.emit();
    this.presentToast();
  }

  async presentToast() {
    const toast = await toastController.create({
      message: 'Your login email has been sent.',
      duration: 3000,
    });
    toast.present();
  }

  @Event()
  chatModalClose: EventEmitter;

  @Prop() userId: any;

  closeModal(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.chatModalClose.emit();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button color="light" href="/" onClick={event => this.closeModal(event)}>
              <ion-icon name="arrow-back" color="light" />
            </ion-button>
          </ion-buttons>
          <ion-title>E-mail Login</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content class="ion-padding">
        <ion-grid>
          <ion-row
            style={{
              'justify-content': 'center',
            }}
          >
            <ion-col
              style={{
                border: '2px solid black',
              }}
              size="12"
              size-md="8"
            >
              <fireenjin-form hideControls>
                <fireenjin-input required name="email" label="E-mail" labelPosition="stacked" type="email" />
                <ion-button type="submit">Send Login E-mail</ion-button>
              </fireenjin-form>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>,
    ];
  }
}
