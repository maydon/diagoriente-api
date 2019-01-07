const Joi = require('joi');
const Theme = require('../models/theme.model');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  // GET /v1/themes
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string()
    }
  },

  // POST /v1/themes
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      description: Joi.string()
        .min(3)
        .max(120)
        .required(),
      type: Joi.string()
        .valid(Theme.types)
        .required(),
      resources: {
        icon: Joi.string(),
        color: Joi.string().max(10),
        backgroundColor: Joi.string().max(10)
      }
    }
  },

  // PATCH /v1/themes/:themeId
  update: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      description: Joi.string()
        .min(3)
        .max(120),
      type: Joi.string()
        .valid(Theme.types)
        .required(),
      activities: Joi.array()
        .items(Joi.objectId())
        .unique(),
      resources: {
        icon: Joi.string(),
        color: Joi.string().max(10),
        backgroundColor: Joi.string().max(10)
      }
    }
  }
};
