#!/bin/bash

# assume token
curl -v -H 'Authorization: Bearer $(ACCESS_TOKEN)' -XPOST http://localhost:3000/api/doctors -d '{ "firstName": "John", "lastName": "Smith", "id": 1, "caption": "MBBS" }'