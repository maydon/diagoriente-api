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
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      email: Joi.string(),
      role: Joi.string().valid(User.roles)
    }
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      last_name: Joi.string(),
      first_name: Joi.string(),
      phone: Joi.string()
        .min(6)
        .max(20)
        .required(),
      role: Joi.string().valid(User.roles),
      adress: validateAdress()
    }
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(128)
        .required(),
      last_name: Joi.string(),
      first_name: Joi.string(),
      phone: Joi.string()
        .min(6)
        .max(20)
        .required(),
      role: Joi.string().valid(User.roles)
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string()
        .min(6)
        .max(128),
      last_name: Joi.string(),
      first_name: Joi.string(),
      phone: Joi.string()
        .min(6)
        .max(20)
        .required(),
      role: Joi.string().valid(User.roles)
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
