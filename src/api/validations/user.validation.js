const Joi = require('../utils/myJoi');
const User = require('../models/user.model');
Joi.objectId = require('joi-objectid')(Joi);

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
    body: {
      password: Joi.string().required(),
      token: Joi.string().required()
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
    },
    headers: {
      context: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
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
  },

  // Register new uset
  addUser: {
    body: {
      uniqId: Joi.string(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(30)
        .required(),
      firstName: Joi.string().max(30),
      lastName: Joi.string().max(30),
      pseudo: Joi.string().max(25),
      institution: Joi.string().max(70),
      question: {
        _id: Joi.string().required(),
        response: Joi.string()
          .max(60)
          .required()
      }
    },
    headers: {
      context: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  renewPasswordBySecretQuestion: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      question: {
        _id: Joi.objectId().required(),
        response: Joi.string()
          .min(1)
          .required()
      }
    }
  },
  updatePasswordBySecretQuestion: {
    body: {
      password: Joi.string()
        .min(6)
        .required(),
      token: Joi.string()
        .min(10)
        .required(),
      // question response
      question: {
        _id: Joi.objectId().required(),
        response: Joi.string()
          .min(1)
          .required()
      },
      email: Joi.string()
        .email()
        .required()
    }
  }
};
