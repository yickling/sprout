import { all, put, takeLatest } from 'redux-saga/effects';

import { setAccessToken, removeAccessToken } from '../helpers';
import { AUTH_REQUEST, AUTH_LOGOUT_REQUEST, AUTH_SUCCESS, AUTH_FORCE_UPDATE_PASSWORD, AUTH_FAILURE, REDIRECT_LOGIN } from '../reducers';
import { login } from '../services';

function* authorize({ payload: { username, password } }) {
  try {
    const { forceUpdatePassword, cognitoUser, accessToken } = yield login(username, password);
    if (!forceUpdatePassword) {
      setAccessToken(accessToken);
      yield put({ type: AUTH_SUCCESS, payload: { accessToken } });
    } else {
      yield put({ type: AUTH_FORCE_UPDATE_PASSWORD, payload: { cognitoUser } });
    }
  } catch (error) {
    let message;
    switch (error.status) {
      case 500: message = '500 Internal Server Error'; break;
      case 401: message = '401 Invalid credentials'; break;
      case 404: message = '404 Not found'; break;
      default: message = 'Something went wrong';
    }
    yield put({ type: AUTH_FAILURE, error, payload: message });
  }
}

function* logout() {
  removeAccessToken()
  yield put({ type: REDIRECT_LOGIN });
}

function* Saga() {
  yield all([
    takeLatest(AUTH_REQUEST, authorize),
    takeLatest(AUTH_LOGOUT_REQUEST, logout)
  ]);
}

export default Saga;