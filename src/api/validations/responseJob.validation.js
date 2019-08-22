const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/contexts
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },

  // POST /v1/contexts
  create: {
    body: {
      response: Joi.boolean().required(),
      questionJobId: Joi.objectId().required()
    }
  },

  // PATCH /v1/contexts
  update: {
    body: {
      response: Joi.boolean().required()
    }
  }
};
