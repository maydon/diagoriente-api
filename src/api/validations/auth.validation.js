const Joi = require('joi');

module.exports = {
  // POST /v1/auth/user
  login: {
    body: {
      uniqId: Joi.string()
    }
  },
  // POST /v1/auth/admin
  loginAdmin: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      userId: Joi.string(),
      refreshToken: Joi.string().required()
    }
  }
};
