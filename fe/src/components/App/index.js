import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'rebass';

import './App.css';

import Dashboard from '../Dashboard';
import Login from '../Login';
import ChangePassword from '../ChangePassword';
import ProtectedZone from '../ProtectedZone';

class App extends Component {
  render() {
    const { history } = this.props;

    return (
      <Provider>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/password/change" component={ChangePassword} />
            <ProtectedZone history={history}>
              <Route path="/" component={Dashboard} />
            </ProtectedZone>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}


const mapStateToProps = state => {
  return {
    token: state.access_token,
    loading: state.loading,
    contacts: state.contacts,
    error: state.auth.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onRequestDog: () => dispatch({ type: "API_CALL_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
