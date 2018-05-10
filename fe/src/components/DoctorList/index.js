import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Doctor from '../Doctor';

import './DoctorList.css';

class DoctorList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { doctors } = this.props;
    const doctorList = doctors.Items.map((doctor, index) => {
      return (
          <Doctor id={doctor.id}
                   name={doctor.firstName + ' ' + doctor.lastName}
                   caption={doctor.caption ? doctor.caption : 'CAPTN'}
                   doctors={doctors} />
      );
    });

    return (
        <div id='doctors'>
          {doctorList}
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
    // onLogin: (username, password) => dispatch(authorize(username, password))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorList));
