const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  // GET /v1/questions
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },

  // PATCH /v1/questions
  create: {
    body: {
      title: Joi.string()
        .max(120)
        .required()
    }
  }
};
