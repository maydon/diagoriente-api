const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {
  // POST /v1/auth/user
  login: {
    body: {
      uniqId: Joi.string(),
      platform: Joi.string().valid(User.platform)
    }
  },
  // POST /v1/auth/admin
  loginAdmin: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /v1/auth/advisor
  loginAdvisor: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .required()
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
