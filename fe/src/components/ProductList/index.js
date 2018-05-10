import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import config from '../../config';
import { getAccessToken } from '../../helpers';

import Product from '../Product';

import './ProductList.css';

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  async fetchProducts() { // Token returned from Stripe
    const res = await fetch(`${config.dal.host}/contacts`, { // Backend API url
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

    const products = response;

    this.setState({
      products
    });
  }

  render() {
    const {products} = this.state;

    const productList = products.map((product, index) => {
      return (
          <Product id={product.id}
                   name={product.name}
                   caption={product.caption}
                   description={product.description}
                   skus={product.skus.data}
                   images={product.images} />
      );
    });

    return (
        <div id='products'>
          {productList}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductList));
