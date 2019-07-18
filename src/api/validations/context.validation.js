const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/contexts
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty('')
    }
  },

  // POST /v1/contexts
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(250)
        .required(),
      description: Joi.string()
    }
  },

  // PATCH /v1/contexts
  update: {
    body: {
      title: Joi.string().min(3),
      description: Joi.string()
    }
  }
};
