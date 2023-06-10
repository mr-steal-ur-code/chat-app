import { Component, ComponentInterface, Prop, h } from '@stencil/core';
import { User } from '../../interfaces';
import isAdmin from '../../helpers/isAdmin';

@Component({
    tag: 'popover-edit-profile',
})
export class PopoverEditProfile implements ComponentInterface {
    @Prop() user: User;
    render() {
        return (
            <fireenjin-form
                name="editProfile"
                endpoint="users"
                resetButton='clear'
                documentId={this.user?.id}
            >
                <fireenjin-input
                    type="text"
                    required
                    name="userName"
                    placeholder="Enter Username"
                    label="Username"
                    labelPosition="stacked"
                    value={this?.user?.userName}
                />
                <fireenjin-input
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    label="First Name"
                    labelPosition="stacked"
                    value={this.user?.firstName}
                />
                <fireenjin-input
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    label="Last Name"
                    labelPosition="stacked"
                    value={this?.user?.lastName}
                />
                <fireenjin-input
                    type="email"
                    required
                    name="email"
                    placeholder="name@example.com"
                    label="Email"
                    labelPosition="stacked"
                    value={this?.user?.email}
                />
                {isAdmin() &&
                    <fireenjin-select
                        name="role"
                        options={[
                            {
                                label: "Tester",
                                value: "tester"
                            }
                        ]}
                        label="Role"
                        labelPosition="stacked"
                        value={this?.user?.role}
                    />}
            </fireenjin-form>
        );
    }
}
