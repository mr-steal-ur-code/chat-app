import { AuthService } from '@fireenjin/sdk';
import { Component, h, Prop, Listen, State, ComponentInterface } from '@stencil/core';
import { toastController } from '@ionic/core';
import env from '../../helpers/env';

@Component({
  tag: 'popover-login-with-email',
})
export class PopoverLoginWithEmail implements ComponentInterface {
  @Prop() auth: AuthService;
  @Prop() userId: any;

  @State() formData: {
    name?: string;
    email?: string;
  } = {};

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
    this.presentToast();
  }

  async presentToast() {
    const toast = await toastController.create({
      message: 'Your login email has been sent.',
      duration: 3000,
    });
    toast.present();
  }

  render() {
    return (
      <fireenjin-form hideControls>
        <fireenjin-input placeholder="name@example.com" required name="email" label="E-mail" labelPosition="stacked" type="email" />
        <ion-button type="submit">Send Login E-mail</ion-button>
      </fireenjin-form>
    );
  }
}
