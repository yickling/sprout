import React, { Component } from 'react';
import { Flex, Box } from 'rebass';
import styled from 'styled-components';

import { Redirect } from 'react-router-dom';
import { isLoggedIn } from '../../helpers';

import './index.css';

import config from '../../config';
import { getAccessToken } from '../../helpers';

import Header from "../Header";
import DoctorList from "../DoctorList";
import EditForm from "../EditForm";


const ScrollArea = styled.div`
   height:600px;
   overflow:auto;
`;

class Dashboard extends Component {

  componentDidMount() {
    this.fetchDoctors();

    this.state = {
      doctors: { Items: [], count: 0, ScannedCount: 0}
    };
  }

  async fetchDoctors() {
    const res = await fetch(`${config.dal.host}/api/doctors`, { // Backend API url
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });

    let response;

    try {
      response = await res.json();
    } catch (e) {
      throw new Error('Cannot connect to server');
    }

    if (res.status === 401) {
      this.props.history.push('/login');
      return;
    }

    const doctors = response;

    this.setState({
      doctors
    });
  }

  render() {
    if (!isLoggedIn()) {
      return <Redirect to="/login" />;
    }

    if (!this.state) return null;

    const { doctors } = this.state

    return (
      <div className="Dashboard">
        <Header/>
        <div className="container">
        <Flex mx={-2}>
          <Box width={1/3} px={2}>
            <ScrollArea>
              <DoctorList doctors={doctors}/>
            </ScrollArea>
          </Box>
          <Box width={2/3} px={2}>
            <EditForm doctors={doctors}/>
          </Box>
        </Flex>
        </div>
      </div>
    );
  }
}

export default Dashboard;
