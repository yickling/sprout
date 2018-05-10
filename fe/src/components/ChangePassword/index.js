import React, { Component } from 'react';
import { Button } from 'rebass';
import { connect } from "react-redux";
import { forceUpdatePassword } from '../../reducers';

import './ChangePassword.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPassword: '',
      inputConfirmPassword: '',
      validated: true,
      imageCode: 'favicon.ico',
      infoMessage: '',
      errorMessage: ''
    };
  }

  componentDidMount() {
    console.error(this.props.cognitoAuthUser)
  }

  forceUpdatePassword(e) {
    var self = this;
    const { onForceUpdatePassword } = this.props;
    onForceUpdatePassword(this.state.inputPassword)
    
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

    function updatePassword(e) {
      self.setState({ inputPassword: e.target.value, validated: (self.state.inputConfirmPassword.length > 0 && self.state.inputPassword.length > 0 ) });
    }

    function updateConfirmPassword(e) {
      self.setState({ inputConfirmPassword: e.target.value, validated: (self.state.inputConfirmPassword.length > 0 && self.state.inputPassword.length > 0 ) });
    }

    const { error } = this.props;

    return (
      <div className="ChangePassword">
        <div className="ChangePassword-header">
          <h2>Update Password</h2>
        </div>

        {error && <p style={{ color: "red" }}>Uh oh - something went wrong! { error } </p>}
        <form>
          <label id="password" label="Password" htmlFor="horizontal-form-input-password">
            <input value={this.inputPassword} onChange={updatePassword} type="password" placeholder="Password" name="horizontal-form-input-password" />
          </label>
          <label id="passwordConfirm" label="Confirm Password" htmlFor="horizontal-form-input-password">
            <input value={this.inputConfirmPassword} onChange={updateConfirmPassword} type="password" placeholder="Confirm Password" name="horizontal-form-input-password" />
          </label>
          <Button disabled={!self.state.validated} onClick={this.forceUpdatePassword.bind(this)}>Submit</Button>
        </form>
      </div>
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
    onForceUpdatePassword: (cognitoAuthUser, password) => dispatch(forceUpdatePassword(cognitoAuthUser, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
