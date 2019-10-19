import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import TeamProfileBody from './../components/team/TeamProfileBody';
import NavBar from './NavBar';

// actions
import { updateTeam, getTeam } from '../actions/team';

class TeamProfile extends Component {

  render () {
    const { user, team, updateTeam } = this.props;
    return (
      <div>
        <NavBar />
        <div className="body">
          <TeamProfileBody
            team={team}
            user={user}
            updateTeam={updateTeam}
          />
        </div>
      </div>
    );
  }
}

// connecting to redux

const mapStateToProps = state => {
  return {
    user: state.user,
    team: state.team,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateTeam,
      getTeam,
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamProfile);

export {
  TeamProfile,
};
