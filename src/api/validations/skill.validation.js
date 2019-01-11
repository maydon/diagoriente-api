const Joi = require('joi');
const Theme = require('../models/theme.model');
const Skill = require('../models/skill.model');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  // GET /v1/themes
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },

  // POST /v1/themes
  create: {
    body: {
      type: Joi.string()
        .valid(Theme.types)
        .required(),
      theme: Joi.objectId(),
      activities: Joi.array().items(Joi.objectId()),
      competences: Joi.array().items({
        id: Joi.objectId(),
        value: Joi.number()
          .integer()
          .min(1)
          .max(4)
      })
    }
  }
};
