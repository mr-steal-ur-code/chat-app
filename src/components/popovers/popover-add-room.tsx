import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'popover-add-room',
})
export class PopoverAddRoom implements ComponentInterface {
  render() {
    return (
      <fireenjin-form endpoint="rooms">
        <fireenjin-input name="name" label="Room Name" labelPosition="stacked" />
        <fireenjin-input name="type" label="Type" labelPosition="stacked" />
      </fireenjin-form>
    );
  }
}
