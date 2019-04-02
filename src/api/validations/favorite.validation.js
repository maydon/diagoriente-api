const Joi = require('joi');

module.exports = {
  // GET /v1/interest
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },
  // patch /v1/interest/:id
  update: {
    body: {
      user: Joi.objectId().required(),
      parcour: Joi.objectId().required(),
      job: Joi.objectId().required(),
      interested: Joi.boolean()
    }
  },

  // post /v1/interest
  create: {
    body: {
      user: Joi.objectId().required(),
      parcour: Joi.objectId().required(),
      job: Joi.objectId().required(),
      interested: Joi.boolean()
    }
  }
};
