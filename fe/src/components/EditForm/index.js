import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Fixed, Modal, Heading, Input, Button } from 'rebass';

import config from '../../config';

import Doctor from '../Doctor';

const toggle = key => state => ({ [key]: !state[key] })

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  componentDidMount() {
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleChange() {

  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ modal: !this.state.modal })
  }

  render() {
    const { currentDoctorId } = this.props;
    const doctor = this.props.doctors.Items.find(d => d.id === currentDoctorId);
    if (!doctor) {
      return (<div>
        Please select a doctor
      </div>)
    }
    const description = '12345'
    return (
      <div className="edit-form">
        <form onSubmit={this.toggleModal.bind(this)}>
          <Heading children='Doctor' />
          <Input
            name='firstName'
            value={doctor.firstName}
            placeholder='First Name'
            onChange={this.handleChange} />
          <Input
            name='lastName'
            value={doctor.lastName}
            placeholder='Last Name'
            onChange={this.handleChange} />
          <Input
            name='caption'
            value={doctor.caption}
            placeholder='Caption'
            onChange={this.handleChange} />
          <Input
            name='description'
            value={description}
            placeholder='Description'
            onChange={this.handleChange} />
          <Button
            type='submit'
            children='Update' />
        </form>
        {this.state.modal && (
          <div>
            <Fixed
              top={0}
              right={0}
              bottom={0}
              left={0}
              onClick={this.toggleModal.bind(this)}
            />
            <Modal width={256}>
              <Heading>Hello</Heading>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    currentDoctorId: state.current.doctorId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onLogin: (username, password) => dispatch(authorize(username, password))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditForm));
