import React, { Component } from 'react';
import { Button } from 'rebass';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { authorize } from '../../reducers';
import { isLoggedIn } from '../../helpers';

import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputEmail: '',
      inputPassword: '',
      inputCode: '',
      validated: true,
      imageCode: 'favicon.ico',
      infoMessage: '',
      errorMessage: ''
    };
  }

  componentDidMount() {
  }

  login(e) {
    var self = this;
    const { onLogin } = this.props;
    onLogin(this.state.inputEmail, this.state.inputPassword)
    
    e.preventDefault();
    // fetch('/login', 
    //   { method: 'POST',
    //     headers: {'Content-Type': 'Loginlication/json'},
    //     mode: 'cors', 
    //     body: JSON.stringify({
    //       email: self.state.inputEmail,
    //       password: self.state.inputPassword,
    //       userToken: self.state.inputCode
    //     })})
    //   .then((response) => {
    //     if (response.status === 401) {
    //       return response.text().then((err) => {
    //         throw new Error(err)
    //       })
    //     }
    //     return response.text()
    //   })
    //   .then((result) => {
    //     console.log(self)
    //     self.setState({ infoMessage: result, errorMessage: '' })
    //   })
    //   .catch((err) => {
    //     console.log(self.state)
    //     self.setState({ errorMessage: err.message, infoMessage: '' })
    //   })
  }

  render() {
    var self = this;

    function updateEmail(e) {
      self.setState({ inputEmail: e.target.value, validated: (self.state.inputEmail.length > 0 && self.state.inputPassword.length > 0 ) });
    }

    function updatePassword(e) {
      self.setState({ inputPassword: e.target.value, validated: (self.state.inputEmail.length > 0 && self.state.inputPassword.length > 0 ) });
    }

    if (this.props.forceUpdatePassword) {
      return <Redirect to="/password/change" />;
    }

    if (isLoggedIn()) {
      return <Redirect to="/" />;
    }

    const { error } = this.props;

    return (
      <div className="Login">
        <div className="Login-header">
          <h2>Welcome to Sprout</h2>
        </div>

        {error && <p style={{ color: "red" }}>Uh oh - something went wrong! { error } </p>}
        <form>
          <label id="email" label="Email address" htmlFor="horizontal-form-input-email">
            <input value={this.inputEmail} onChange={updateEmail} type="email" placeholder="Enter email" name="horizontal-form-input-email" />
          </label>
          <label id="password" label="Password" htmlFor="horizontal-form-input-password">
            <input value={this.inputPassword} onChange={updatePassword} type="password" placeholder="Password" name="horizontal-form-input-password" />
          </label>
          <Button disabled={!self.state.validated} onClick={this.login.bind(this)}>Submit</Button>
        </form>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    forceUpdatePassword: state.auth.forceUpdatePassword,
    cognitoUser: state.auth.cognitoUser,
    loading: state.loading,
    contacts: state.contacts,
    error: state.auth.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, password) => dispatch(authorize(username, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
