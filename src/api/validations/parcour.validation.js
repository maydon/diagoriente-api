const Joi = require('joi');
const Activity = require('../models/activity.model');

module.exports = {
  // GET /v1/activities
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },

  // POST /v1/activities
  create: {
    body: {
      skills: Joi.array()
        .items(Joi.objectId())
        .unique(),
      completed: Joi.boolean()
    }
  },

  // get /v1/parcour/:id
  get: {
    params: {
      parcourId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
