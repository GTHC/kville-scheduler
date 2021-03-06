import React, { Component } from 'react';

import { Form, Message, Loader, Dimmer } from 'semantic-ui-react';

// utils
import dropdownOptions from './../../signup/steps/utils/dropdownOptions';

export default class EditTeamPane extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: props.team.data.name,
      tentType: props.team.data.tent_type,
      disabled: false,
      savePressed: false,
      loading: props.user.isLoading,
    };
  }

  onInputChange = (e, { id, value }) => {
    this.setState({
      savePressed: false,
      [id]: value,
    }, () => { this.validInput(); });
  };

  onSave = () => {
    const { team, updateTeam } = this.props;
    const { name, tentType } = this.state;
    const data = {
      name,
      tent_type: tentType,
    };
    this.setState({ savePressed: true });
    updateTeam(team.data.id, data);
  };

  validInput = () => {
    const { name } = this.state;
    if (name.trim() == '') {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  };

  renderError = () => (
    <Message negative>
      <p>{ 'You are not the captain. You do not have access to changing team information.' }</p>
    </Message>
  );

  renderIsCaptain = () => {
    const { user, team } = this.props;
    const { disabled, name, tentType, loading, savePressed } = this.state;
    const error = user.error || team.error;
    return (
      <div>
        <Message positive attached>
          <p>{ 'You are the captain. You have access to editing team information.' }</p>
        </Message>
        <Form className='attached fluid segment'>
          <Form.Input
            fluid
            type="text"
            id="name"
            error={disabled}
            label="Team Name"
            placeholder="Team Name"
            value={name}
            onChange={this.onInputChange}
          />
          <Form.Dropdown
            fluid
            search
            selection
            id="tentType"
            label="Team Type"
            placeholder='Team Type'
            options={dropdownOptions}
            onChange={this.onInputChange}
            defaultValue={tentType}
          />
          <Form.Button disabled={disabled} onClick={this.onSave}>Save</Form.Button>
        </Form>
        { loading &&
          <Dimmer active>
            <Loader>Updating</Loader>
          </Dimmer>
        }
        {
          !loading && savePressed && !error &&
          <Message
            positive
            attached
            icon="check"
            header="Updated Successfully!"
            content="Team information has been updated."
          />
        }
        {
          !loading && savePressed && error &&
          <Message
            negative
            attached
            icon="x"
            header="Error"
            content="Team information has not been updated."
          />
        }
        {
          disabled &&
          <Message
            warning
            attached
            icon="exclamation triangle"
            header="Warning!"
            content="Please fill in all details."
          />
        }
      </div>
    );
  };

  render () {
    const { team, user } = this.props;
    const captain = team.data.captain
    return (
      <div>
        {
          captain.user_id === user.data.id ?
          this.renderIsCaptain()
          :
          this.renderError()
        }
      </div>
    );
  }
}
