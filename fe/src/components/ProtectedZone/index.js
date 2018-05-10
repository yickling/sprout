import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isLoggedIn, removeAccessToken } from '../../helpers';

class ProtectedZone extends Component {
  componentDidMount() {
    const { dispatch, currentUrl } = this.props

    if (!isLoggedIn()) {
      // set the current url/path for future redirection (we use a Redux action)
      // then redirect (we use a React Router method)
      // dispatch(setRedirectUrl(currentUrl))
      removeAccessToken()
      this.props.history.replace("/login")
    }
  }

  render() {
    if (isLoggedIn()) {
      return this.props.children
    } else {
      return <Redirect to='/login' />;
    }
  }
}

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
  return {
    currentUrl: ownProps.location.pathname,
    redirectUrl: state.redirect.redirectUrl
  }
}

export default connect(mapStateToProps)(ProtectedZone)