import React, { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';

import Availability from '../../availability/index';

class Schedule extends Component {
  constructor (props) {
    super(props);
    this.state = {
      availability: props.user.availability,
      disabled: true,
      savePressed: false,
      loading: props.userState.isLoading,
    };
  }

  updateAvailState = availability => this.setState({
    availability,
    disabled: false,
    savePressed: false,
  });

  onSave = () => {
    const { updateAvailability } = this.props;
    const { availability } = this.state;
    updateAvailability({ availability });
    this.setState({ savePressed: true, disabled: true });
  };

  render () {
    const { availability, disabled, savePressed, loading } = this.state;
    return (
      <div>
        <Availability updateAvailState={this.updateAvailState} {...this.props} />
        <Button disabled={disabled} onClick={this.onSave}>Save</Button>
        {
          !loading && savePressed &&
          <Message
            positive
            attached
            icon="check"
            header="Updated Successfully!"
            content="Your availability information has been changed."
          />
        }
      </div>
    );
  }
}

export default Schedule;