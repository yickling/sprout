import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_LOGOUT_REQUEST = 'AUTH_LOGOUT_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FORCE_UPDATE_PASSWORD = 'AUTH_FORCE_UPDATE_PASSWORD';
export const AUTH_FORCE_UPDATE_PASSWORD_ATTEMPT = 'AUTH_FORCE_UPDATE_PASSWORD_ATTEMPT';
export const AUTH_FAILURE = 'AUTH_FAILURE';
export const REDIRECT_LOGIN = 'REDIRECT_LOGIN';
export const UPDATE_CURRENT_DOCTOR = 'UPDATE_CURRENT_DOCTOR';

export const authorize = (username, password) => ({
  type: AUTH_REQUEST,
  payload: { username, password }
});

export const logout = () => ({
  type: AUTH_LOGOUT_REQUEST
});

export const forceUpdatePassword = (cognitoUser, password) => ({
  type: AUTH_FORCE_UPDATE_PASSWORD_ATTEMPT,
  payload: { cognitoUser, password }
});

export const updateCurrentDoctor = (doctorId) => ({
  type: UPDATE_CURRENT_DOCTOR,
  payload: { doctorId }
});

const initialState = {
  auth: {
    token: cookies.get('access_token'),
    error: null
  },
  redirect: {
  },
  current: {
    doctorId: null
  }
};

const authReducer = (state = initialState.auth, { type, payload }) => {
  switch (type) {
    case AUTH_SUCCESS: {
      return { ...state, accessToken: payload.accessToken };
    }
    case AUTH_FORCE_UPDATE_PASSWORD: {
      return { ...state, forceUpdatePassword: true, cognitoUser: payload.cognitoUser };
    }
    case AUTH_FAILURE: {
      return { ...state, error: payload }
    }
    default:
      return state;
  }
};

const currentReducer = (state = initialState.current, { type, payload }) => {
  switch (type) {
    case UPDATE_CURRENT_DOCTOR: {
      console.log(33, payload)
      return { ...state, doctorId: payload.doctorId };
    }
    default:
      return state;
  }
};

const redirectReducer = (state = initialState.redirect, { type, payload }) => {
  switch (type) {
    case REDIRECT_LOGIN: {
      return { ...state, redirectUrl: '/login', nextRedirectUrl: payload ? payload.redirectUrl : undefined };
    }
    default:
      return state;
  }
};

const reducer = combineReducers({
  auth: authReducer,
  redirect: redirectReducer,
  current: currentReducer,
  router: routerReducer
});

export default reducer;