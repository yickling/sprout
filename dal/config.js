const config = {
  dal: {
    host: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.heals.com'
  },
  cognito: {
    region: 'ap-northeast-1',
    userPool: {
      UserPoolId: 'ap-northeast-1_Y3bps5DhN',
      ClientId: '48a34cj9ne7s3apgemkvpevvre'
    },

    identityPool: {
      id: 'ap-northeast-1:72c11a62-7169-4d7d-a4bc-33bd1abbac37', // your identity pool id here
      loginKey: 'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_Y3bps5DhN'
    }
  },
  dynamodb: {
    endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://dynamodbendpoint',
    region: process.env.NODE_ENV === 'development' ? 'localhost' : 'ap-northeast-1',
    accessKeyId: process.env.NODE_ENV === 'development' ? '' : '',
    secretAccessKey: process.env.NODE_ENV === 'development' ? '' : ''
  }
};

module.exports = config;