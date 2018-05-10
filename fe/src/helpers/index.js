import Cookies from 'universal-cookie';

const cookies = new Cookies();

function isLoggedIn() {
  const accessToken = cookies.get('access_token');
  return !!accessToken;
}

function setAccessToken(accessToken) {
  cookies.set('access_token', accessToken);
}

function getAccessToken() {
  return cookies.get('access_token');
}

function removeAccessToken() {
  cookies.remove('access_token');
}

export { isLoggedIn, getAccessToken, setAccessToken, removeAccessToken };