const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {
  // GET /v1/users
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      role: Joi.string()
        .valid(User.roles)
        .default('user')
    }
  },

  renewPassword: {
    body: {
      email: Joi.string()
        .email()
        .required()
    }
  },

  updatePassword: {
    query: {
      token: Joi.string().required()
    },
    body: {
      password: Joi.string().required()
    }
  },

  // PATCH /v1/users/:userId
  update: {
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    },
    body: {
      OldPassword: Joi.string()
        .min(6)
        .max(30),
      password: Joi.string()
        .min(6)
        .max(30),
      pseudo: Joi.string().max(30),
      firstName: Joi.string().max(30),
      lastName: Joi.string().max(30)
    }
  },

  // POST /v1/users/advisors
  addAdvisor: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .required(),
      firstName: Joi.string().max(30),
      lastName: Joi.string().max(30),
      institution: Joi.string().max(70)
    }
  },
  // PATCH /v1/users/advisors

  updateAdvisor: {
    body: {
      OldPassword: Joi.string()
        .min(6)
        .max(30),
      password: Joi.string()
        .min(6)
        .max(30),
      pseudo: Joi.string().max(30),
      firstName: Joi.string().max(30),
      lastName: Joi.string().max(30),
      institution: Joi.string().max(70)
    }
  },

  // PUT /v1/users/me/:id
  aprouvedUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .required(),
      firstName: Joi.string().max(30),
      lastName: Joi.string().max(30),
      pseudo: Joi.string().max(25)
    }
  }
};
