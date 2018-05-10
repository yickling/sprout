import React, {Component} from "react";
import { connect } from 'react-redux';
import { updateCurrentDoctor } from '../../reducers';

import "./Doctor.css";

class Doctor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentImage: 0,
      currentDoctor: props.doctors && props.doctors.Items ? props.doctors.Items[0] : null
    };
  }

  switchActiveDoctor() {
    const { id, switchDoctor } = this.props;
    console.log(this.props)
    console.log('switch!!', id)
    switchDoctor(id)
  }

  render() {
    const {id, name, caption, description, doctors} = this.props;
    const {currentDoctor} = this.state;

    // const doctorList = doctors.Items.map((doctor, index) => {

    //   return (
    //       <div key={doctor.id}
    //            className={"col-xs-2 Doctor-sku " + (currentDoctor.id === doctor.id
    //                ? 'selected' : '')}
    //            onClick={() => this.setState({currentDoctor: doctor})}>
    //         {doctor.name}
    //       </div>
    //   );
    // });

    return (
        <div key={id} className="Doctor row" onClick={this.switchActiveDoctor.bind(this)}>
          <div className="Doctor-details col-xs-12 col-sm-6 col-lg-4">
            <h2 className="Doctor-name">{name}</h2>
            <h1 className="Doctor-caption">{caption}</h1>
            <div
                className="Doctor-price">
              <div>{'euros'}.{'cents'}</div>
              <div className="Doctor-taxes">inkl MwSt.</div>
            </div>
            <p className="Doctor-description">{description}</p>
            <hr/>
          </div>
        </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    currentDoctorId: state.current.doctorId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    switchDoctor: (doctorId) => dispatch(updateCurrentDoctor(doctorId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);