import { AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
import config from '../config'
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from '../reducers';
import backend from './backend';

const fetchJSON = (url, options = {}) =>
  new Promise((resolve, reject) => {
    return fetch(url, options)
      .then(response => (response.status !== 200 ? reject(response) : response))
      .then(response => response.json())
      .then(response => resolve(response))
      .catch(error => reject(error));
  });

export async function loginNonCognito(username, password) {
  const options = {
    body: JSON.stringify({ username, password }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const { access_token } = await fetchJSON(`${config.dal.host}/api/oauth2/login`, options);
  return access_token;
}

export default { backend, login }
export async function login(username, password) {
  const authenticationDetails = new AuthenticationDetails({ Username: username, Password: password });
  const poolData = config.cognito.userPool;

  const userPool = new CognitoUserPool(poolData);
  const userData = {
      Username : username,
      Pool : userPool
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            AWS.config.region = config.cognito.region;

            const credentials = {
                IdentityPoolId : config.cognito.identityPool.id, // your identity pool id here
                Logins : {}
            };

            credentials.Logins[config.cognito.identityPool.loginKey] = result.getIdToken().getJwtToken()
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(credentials);

            console.log('about to try')
            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh((error) => {
              if (error) {
                console.error(error);
              } else {
                console.log('Successfully logged!');
                return resolve({ forceUpdatePassword: false, cognitoUser, accessToken: result.getAccessToken().getJwtToken()});
              }
            });
        },

        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },

        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new 
            // password and required attributes, if any, to complete 
            // authentication.

            // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user. 
            // Required attributes according to schema, which don’t have any values yet, will have blank values.
            // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.

            
            // Get these details and call 
            // newPassword: password that user has given
            // attributesData: object with key as attribute name and value that the user has given.
            console.log('attributes: ', userAttributes)
            console.log('completing new password!')
            return resolve({ forceUpdatePassword: true, cognitoUser })
            // const attributesData = { given_name: 'testguy' }
            // cognitoUser.completeNewPasswordChallenge('NewPass1234!', attributesData, this)
        }
    });
  });
}