const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {
  // POST /v1/auth/login
  login: {
    body: {
      role: Joi.string().valid(User.roles),
      uniqId: Joi.string()
    }
  },

  // POST /v1/auth/refresh
  refresh: {
    body: {
      uniqId: Joi.string(),
      refreshToken: Joi.string().required()
    }
  }
};
