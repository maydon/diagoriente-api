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
        .max(100)
    }
  },

  // POST /v1/skills
  create: {
    body: {
      parcourId: Joi.objectId().required(),
      type: Joi.string()
        .valid(Theme.types)
        .required(),
      theme: Joi.objectId(),
      activities: Joi.array().items(Joi.objectId()),
      competences: Joi.array().items({
        _id: Joi.objectId().required(),
        value: Joi.number()
          .integer()
          .min(0)
          .max(4)
      })
    }
  },

  createMulti: {
    body: {
      parcourId: Joi.objectId().required(),
      skills: Joi.array().items(Joi.object({
        type: Joi.string()
          .valid(Theme.types)
          .required(),
        theme: Joi.objectId(),
        activities: Joi.array().items(Joi.objectId()),
        competences: Joi.array().items({
          _id: Joi.objectId().required(),
          value: Joi.number()
            .integer()
            .min(0)
            .max(4)
        })
      }))
    }
  },

  // patch /v1/skills
  update: {
    body: {
      type: Joi.string().valid(Theme.types),
      theme: Joi.objectId(),
      activities: Joi.array().items(Joi.objectId()),
      competences: Joi.array().items({
        _id: Joi.objectId().required(),
        value: Joi.number()
          .integer()
          .min(1)
          .max(4)
      })
    },
    params: {
      skillId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
