import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button } from 'rebass';
import { logout } from '../../reducers';

import "./Header.css";

class Header extends Component {
  componentDidMount() {

  }

  logout() {
    this.props.onLogout();
  }

  render () {
    return (
      <nav className="header navbar navbar-light bg-light container-fluid">
        <span className="navbar-brand mb-0">
          <Button onClick={this.logout.bind(this)}>
            Logout
          </Button>
        </span>
      </nav>
    );
  }
}


const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);