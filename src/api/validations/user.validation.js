const Joi = require('joi');
const User = require('../models/user.model');

function validateAdress(adress) {
  const schema = {
    street: Joi.string()
      .min(3)
      .required(),
    city: Joi.string()
      .max(50)
      .required()
      .email(),
    postal_code: Joi.string()
      .min(5)
      .max(8)
      .required(),
    country: Joi.string()
      .min(5)
      .max(50)
      .required(),
    position: Joi.string()
      .min(5)
      .max(50)
  };
  return Joi.validate(adress, schema);
}

module.exports = {
  // GET /v1/users
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },

  // PATCH /v1/users/:userId
  update: {
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
