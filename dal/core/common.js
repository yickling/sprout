const request = require('request-promise-native');
const jose = require('node-jose');
const config = require('../config');

const keys_url = 'https://cognito-idp.' + config.cognito.region + '.amazonaws.com/' + config.cognito.userPool.UserPoolId + '/.well-known/jwks.json';

let cognitoKeys;

async function getCognitoKeys() {
  // download the public keys
  const response = await request(keys_url);
  cognitoKeys = response;
  return;
}

async function verifyAuthenticated(headers) {
  if (!cognitoKeys) {
    await getCognitoKeys();
  }

  if (!headers['Authorization']) return { error: new Error('No access token') };

  try {
    const token = headers['Authorization'].split(' ')[1];
    const sections = token.split('.');

    // get the kid from the headers prior to verification
    const header = JSON.parse(jose.util.base64url.decode(sections[0]));

    const kid = header.kid;
    
    var keys = JSON.parse(cognitoKeys)['keys'];
    // search for the kid in the downloaded public keys
    var key_index = -1;
    for (var i=0; i < keys.length; i++) {
      if (kid == keys[i].kid) {
          key_index = i;
          break;
      }
    }
    if (key_index == -1) {
      console.log('Public key not found in jwks.json');
      return { error: new Error('Public key not found in jwks.json') };
    }

    // construct the public key
    const publicKey = await jose.JWK.asKey(keys[key_index]);

    // verify the signature
    const result = await jose.JWS.createVerify(publicKey).verify(token);
    // now we can use the claims
    const claims = JSON.parse(result.payload);

    // additionally we can verify the token expiration
    current_ts = Math.floor(new Date() / 1000);
    if (current_ts > claims.exp) {
      return { error: new Error('Token is expired') };
    }

    // and the Audience (use claims.client_id if verifying an access token)
    if (claims.client_id != config.cognito.userPool.ClientId) {
      return { error: new Error('Token was not issued for this audience') };
    }

    return { claims };
  }
  catch (e) {
    console.error(999, e)
    return { error: new Error('Signature verification failed'), stack: e };
  }
}

module.exports = { verifyAuthenticated }