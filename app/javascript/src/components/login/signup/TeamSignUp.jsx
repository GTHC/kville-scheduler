import React, { Component } from 'react';

// semantic ui components
import { Button, Divider, Form, Message } from 'semantic-ui-react';

// utils
import { generate } from 'randomstring';
import dropdownOptions from './utils/dropdownOptions';
import PasscodeCheck from './utils/PasscodeCheck';

class TeamSignUp extends Component {
  constructor(props) {
    super(props);
    const data = props.login.signUpData;
    this.state = {
      /**
       * stepType: This will define what is displayed for this step.
       * 0: Create Team vs Join Team?
       * 1: Create Team
       * 2: Join Team
       * @type {Number}
       */
      stepType: 0,

      // User is either creating or joining a team (used in validInput())
      teamType: '',
      team: data.team,
      teamID: data.teamID,
      tentType: data.tentType,
      tentNumber: data.tentNumber,
      isCaptain: false,
      errorMessage: '',
      passcode: data.passcode,

      // this is the value of the passcode input by the user when joining a team
      joinPasscode: '',
      showJoinPasscode: false, // shows PasscodeCheck component
      correctPasscode: false,
    };

    // checks if next button should be active or not
    // (useful for situations where user comes from a future page)
    if (data.team && data.tentType && data.tentNumber) {
      props.toggleDisableNext(false);
    }
  }

  onInputChange = (e, data) => {
    // check if tentNumber is actually a number
    this.setState({ [data.id]: e.target.value },
      () => {this.validInput()}
    );
  }

  validInput = () => {
    const { stepType, team, tentType, tentNumber, teamType, correctPasscode } = this.state;
    const { toggleDisableNext, updateTeamInfo, login } = this.props;
    const tentNumbers = login.teams.map(team => team.tent_number);
    if (stepType === 1 && (team === '' || tentType === '' || tentNumber === '')) {
      this.setState({ errorMessage: 'Make sure all fields are filled.' });
      toggleDisableNext(true);
    } else if (isNaN(tentNumber) && stepType === 1) {
      this.setState({ errorMessage: 'Tent Number must be a number.' });
      toggleDisableNext(true);
    } else if (teamType === 'create' && tentNumbers.includes(parseInt(tentNumber))) {
      this.setState({ errorMessage: 'Tent Number is already being used by another team.' });
      toggleDisableNext(true);
      return;
    } else if (stepType == 2 && !correctPasscode) {
      toggleDisableNext(true);
    } else if (stepType > 0) {
      this.setState({ errorMessage: '' });
      updateTeamInfo(this.state);
      toggleDisableNext(false);
    }
  };

  dropdownChange = (e, data) => {
    this.setState({ tentType: data.value },
      () => {this.validInput()}
    );
  }

  teamDropDownChange = (e, data) => {
    const toTitleCase = (str) => {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    const { teams } = this.props.login;
    const team = teams.find(team => team.id === data.value);
    const tentType = toTitleCase(team.tent_type);
    this.setState({
      team: team.name,
      teamID: team.id,
      tentNumber: team.tent_number,
      tentType: tentType,
      passcode: team.passcode,
      isCaptain: false,
      showJoinPasscode: true,
      correctPasscode: false,
    },
      () => {this.validInput()}
    );
  };

  /**
   * handleFoundPasscode - function for PasscodeCheck component when passcode is correctly typed by user
   */
  handleFoundPasscode = () => (this.setState({ correctPasscode: true },
    () => {this.validInput();}
  ));

  render() {
    const { stepType, team, tentType, tentNumber, passcode, errorMessage, showJoinPasscode } = this.state;
    const { toggleDisableNext, login } = this.props;
    return (
      <div>
        <div>
          <Button basic={stepType !== 1} content='Create A Team' color="blue" onClick={() => {
              this.setState({
                teamType: 'create',
                stepType: 1,
                isCaptain: true,
                team: '',
                tentType: '',
                tentNumber: '',
                passcode: generate(5).toUpperCase(),
                showJoinPasscode: false,
              });
              toggleDisableNext(true);
            }}
          />
          <Button basic={stepType !== 2} content='Join A Team' color="blue" onClick={() => {
              this.setState({
                teamType: 'join',
                stepType: 2,
                isCaptain: false,
                correctPasscode: false,
              });
              toggleDisableNext(true);
            }}
          />
        </div>
        <br />
        { stepType === 1 ?
              <div>
                <Form.Input
                  fluid
                  value={team}
                  id="team"
                  label="Team Name"
                  placeholder="Team Name"
                  onChange={this.onInputChange}
                />
                <Form.Input
                  fluid
                  value={tentNumber}
                  id="tentNumber"
                  label="Team Number"
                  placeholder="Team Number"
                  onChange={this.onInputChange}
                />
                <Form.Dropdown
                  id="tentType"
                  fluid
                  label="Team Type"
                  placeholder='Team Type'
                  search
                  selection
                  options={dropdownOptions}
                  onChange={this.dropdownChange}
                  defaultValue={tentType}
                />
                <Message>
                  <Message.Header>Team Passcode</Message.Header>
                  Give this to your team-mates, so, they can join your team - <b>{passcode}</b>
                </Message>
            </div> :
              null
        }
        {stepType === 2 ?
          <div>
            <Form.Dropdown
              fluid
              label="Team Name & Number"
              placeholder='Find your team'
              search
              selection
              options={login.teamDropDownOptions}
              onChange={this.teamDropDownChange}
            />
            {
              showJoinPasscode &&
              <PasscodeCheck
                passcode={passcode} handleFoundPasscode={this.handleFoundPasscode.bind(this)}
              />
            }
          </div>
          : null
      }
        <br />
        <p style={{ color: 'red' }}>
          {errorMessage}
        </p>
      </div>
    );
  }
}

export default TeamSignUp;
