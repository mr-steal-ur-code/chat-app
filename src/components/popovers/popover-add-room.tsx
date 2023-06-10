import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'popover-add-room',
})
export class PopoverAddRoom implements ComponentInterface {
  render() {
    return (
      <fireenjin-form name="addRoom" endpoint="rooms">
        <fireenjin-input placeholder="new room name" required name="name" label="Room Name" labelPosition="stacked" />
        <fireenjin-radios
          name="type"
          required
          options={[
            { label: 'Text', value: 'text' },
            { label: 'Voice', value: 'voice' },
          ]}
        />
      </fireenjin-form>
    );
  }
}
