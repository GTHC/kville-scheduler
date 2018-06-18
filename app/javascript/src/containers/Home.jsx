import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// redux actions
import {
  login,
  logout,
} from './../actions/login';

// components
import Test from './../components/Test';
import NavBar from './NavBar';
import { Button } from 'semantic-ui-react';


class Home extends Component {
  handleLogout = () => {
    this.props.logoutUser();
  }

  render() {
    return (
        <div>
          <NavBar />
          <Test />
          <Button
            content="Logout"
            onClick={this.handleLogout}
          />
        </div>
    );
  }
}

// connecting to redux

const mapStateToProps = (state) => {
  return {
    user: state.user,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loginUser: login, // changed login and logout action names due to login state name
      logoutUser: logout,
    },
    dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

export {
  Home
};
