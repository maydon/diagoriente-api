const Joi = require('joi');

module.exports = {
  // GET /v1/interest
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty('')
    }
  },
  // patch /v1/interest/:id
  update: {
    body: {
      nom: Joi.string()
        .min(1)
        .max(30)
        .required()
    }
  },

  // post /v1/interest
  create: {
    body: {
      nom: Joi.string()
        .min(1)
        .max(30)
        .required()
    }
  }
};
