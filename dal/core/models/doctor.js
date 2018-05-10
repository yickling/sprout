const dynamodb = require('serverless-dynamodb-client');
const AWS = require('aws-sdk');
const config = require('../../config')
const { verifyAuthenticated } = require('../../core/common')

AWS.config.update({
  region : config.dynamodb.region,
  endpoint : config.dynamodb.endpoint,
  accessKeyId : config.dynamodb.accessKeyId,
  secretAccessKey : config.dynamodb.secretAccessKey
});

const tableName = 'doctors'
const docClient = dynamodb.doc;  // return an instance of new AWS.DynamoDB.DocumentClient()

function listDoctors() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName : tableName,
      ProjectionExpression : "id, firstName, lastName, caption",
      // FilterExpression : "#yr between :start_yr and :end_yr",
      // ExpressionAttributeNames : {
      //     "#yr" : "year",
      // },
      // ExpressionAttributeValues : {
      //     ":start_yr" : 1950,
      //     ":end_yr" : 2999
      // }
    };
    
    docClient.scan(params, function(err, data) {
      if (err) {
        console.error(err);
        return reject({ error: err });
      } else {
        console.log("Query succeeded.", data);
        return resolve(data);
      }
    });
  })
}

function validatePayload(payload) {
  return payload.firstName && payload.lastName
}
function createDoctor(payload) {
  return new Promise((resolve, reject) => {
    if (!validatePayload(payload)) return reject(new Error('invalid payload'))
    const params = {
      TableName : tableName,
      Item: payload
    };
    
    docClient.put(params, function(err, data) {
      if (err) {
        console.error(err);
        return reject({ error: err });
      } else {
        console.log("Create succeeded.");
        return resolve();
      }
    });
  })
}

function updateDoctor(id, payload) {
  return new Promise((resolve, reject) => {
    if (!validatePayload(payload)) return reject(new Error('invalid payload'))
    const params = {
      TableName : tableName,
      Key:{
          "id": parseInt(id)
      },
      UpdateExpression: "set firstName=:f, lastName=:l",
      ExpressionAttributeValues:{
          ":f": payload.firstName,
          ":l": payload.lastName,
          // ":a":["Larry", "Moe", "Curly"]
      },
      ReturnValues:"UPDATED_NEW"
    };
    
    docClient.update(params, function(err, data) {
      if (err) {
        console.error(err);
        return reject({ error: err });
      } else {
        console.log("Update succeeded.");
        return resolve();
      }
    });
  })
}

async function get(event) {
  const result = await verifyAuthenticated(event.headers);
  let statusCode = 500, body = {};

  if (result.error) {
    statusCode = 401;
    body.message = result.error.message;
  } else {
    statusCode = 200;
    const results = await listDoctors()
    body = results;
  }

  const response = {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }

  return response;
}

async function post(event, context) {
  try {
    const payload = JSON.parse(event.body)
    const results = await createDoctor(payload)
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: results
    }

    return response;
  } catch (e) {
    console.error(e.message)
    if (e.message === 'invalid payload' || e.message === 'Unexpected end of JSON input')
      return { statusCode: 400, body: 'invalid payload' }
    else
      return { statusCode: 500, body: JSON.stringify(e) }
  }
}

async function put(event, context) {
  try {
    const payload = JSON.parse(event.body)
    const results = await updateDoctor(event.pathParameters.id, payload)
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: results
    }

    return response;
  } catch (e) {
    console.error(e.message)
    if (e.message === 'invalid payload' || e.message === 'Unexpected end of JSON input')
      return { statusCode: 400, body: 'invalid payload' }
    else
      return { statusCode: 500, body: JSON.stringify(e) }
  }
}

module.exports = { get, post, put };