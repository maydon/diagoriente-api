const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example')
});

let ext = '';
if (process.env.NODE_ENV === 'production') ext = '_PROD';
else if (process.env.NODE_ENV === 'test') ext = '_TESTS';

module.exports = {
  serverUrl: process.env[`SERVER_URL${ext}`],
  env: process.env.NODE_ENV,
  port: process.env[`PORT${ext}`],
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env[`MONGO_URI${ext}`]
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
