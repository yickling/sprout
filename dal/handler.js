const { verifyAuthenticated } = require('./core/common')
const _ = require('lodash')

async function getContacts (event, context, callback) {
  const result = await verifyAuthenticated(event.headers);
  let statusCode = 500, body = {};

  if (result.error) {
    statusCode = 401;
    body.message = result.error.message;
  } else {
    statusCode = 200;
    body = [{ id: 1, name: 'some other t-shirt', caption: 'worn by steve jobs', description: 'what a nice one', skus: { data: [{ price: '45600', attributes: { size: 'XS' }, currency: 'usd', inventory: { quantity: 77 } }] }, images: ['https://i5.walmartimages.com/asr/0503ea34-07a0-4f34-9f24-602439580089_1.2bc5f8f9621aade987e72cb4852f74d4.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF'] }];
  }

  const response = {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  return response;
}

async function login (event, context, callback) {
  const jsonBody = JSON.parse(event.body)
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ access_token: 'hahaha' })
  }

  return response;
}

module.exports = { getContacts, login }
