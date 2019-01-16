const Joi = require('joi');

module.exports = {
  // GET /v1/competences
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty('')
    }
  },

  // POST /v1/competences
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      rank: Joi.string().required()
    }
  },

  // PATCH /v1/competences
  update: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      rank: Joi.string().required()
    }
  }
};
