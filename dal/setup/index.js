const dynamodb = require('serverless-dynamodb-client');
const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({
  region : config.dynamodb.region,
  endpoint : config.dynamodb.endpoint,
  accessKeyId : config.dynamodb.accessKeyId,
  secretAccessKey : config.dynamodb.secretAccessKey
});
//create a client object for dynamoDB
var rawClient = dynamodb.raw;

function createDoctorsTable(callback) {
  // console.log('createTable');
  const params = {
    TableName : "doctors",
    // TableName : config.tableName,
    KeySchema : [ {
        AttributeName : "id",
        KeyType : "HASH"
      }, // Partition key

    ],
    AttributeDefinitions : [ {
        AttributeName : "id",
        AttributeType : "N"
      },
    ],
    ProvisionedThroughput : {
      ReadCapacityUnits : 100,
      WriteCapacityUnits : 100
    }
  };

  console.log('Checking if table exists: ' + 'doctors' + ' in '
          + AWS.config.region);
  rawClient.createTable(params, callback);
}

function checkAndCreateTable() {
  return new Promise((resolve, reject) => {
    createDoctorsTable((err, results) => {
      if (err) {
        if (err.message.indexOf('Table already exists') != -1) {
          console.log('table found!');
          console.log(err.message);
          return resolve();
        } else {
          console.log(err);
          return reject(err);
        }
      } else {
        console.log('Database initialization complete.');
        return resolve();
      }
    })
  })
}

async function initDb() {
  await checkAndCreateTable()
  console.log('done init!');

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  return response;
}

module.exports = { initDb };