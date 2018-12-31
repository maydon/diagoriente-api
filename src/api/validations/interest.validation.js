const Joi = require('joi');

module.exports = {
  // GET /v1/interest
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string()
    }
  },
  // patch /v1/interest/:id
  update: {
    body: {
      nom: Joi.string()
        .min(1)
        .max(30)
        .required(),
      rank: Joi.number()
        .min(1)
        .max(1000)
    }
  },
  // post /v1/interest
  create: {
    body: {
      nom: Joi.string()
        .min(1)
        .max(30)
        .required(),
      rank: Joi.number()
        .min(1)
        .max(1000)
    }
  }
};
