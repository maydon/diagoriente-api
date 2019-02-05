const Joi = require('joi');

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

  // PUT /v1/users/me/profil
  aprouvedUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      pseudo: Joi.string().max(25)
    }
  }
};
