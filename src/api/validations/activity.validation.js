const Joi = require('joi');
const Activity = require('../models/activity.model');

module.exports = {
  // GET /v1/activities
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string()
    }
  },

  // POST /v1/activities
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      type: Joi.string()
        .valid(Activity.types)
        .required(),
      verified: Joi.boolean().required()
    }
  },

  // PATCH /v1/activities
  update: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      type: Joi.string()
        .valid(Activity.types)
        .required(),
      interests: Joi.array()
        .items(Joi.objectId())
        .unique(),
      verified: Joi.boolean().required()
    }
  }
};
