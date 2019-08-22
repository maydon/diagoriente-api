const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/contexts
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty(''),
      jobId: Joi.objectId().allow('')
    }
  },

  // POST /v1/contexts
  create: {
    body: {
      label: Joi.string()
        .min(3)
        .max(250)
        .required(),
      jobId: Joi.objectId().required()
    }
  },

  // PATCH /v1/contexts
  update: {
    body: {
      label: Joi.string()
        .min(3)
        .max(250),
      jobId: Joi.objectId()
    }
  }
};
