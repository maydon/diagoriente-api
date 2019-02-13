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
      search: Joi.string().empty(''),
      type: Joi.string().valid(Theme.types)
    }
  },

  createSecteur: {
    title: Joi.string()
      .min(3)
      .max(250)
      .required(),
    description: Joi.string()
      .min(3)
      .required(),
    type: Joi.string()
      .valid(Theme.types)
      .required(),
    secteurChilds: Joi.array()
      .items(Joi.objectId())
      .unique()
  },

  updateSecteur: {
    title: Joi.string()
      .min(3)
      .max(250)
      .required(),
    description: Joi.string()
      .min(3)
      .required(),
    type: Joi.string()
      .valid(Theme.types)
      .required(),
    secteurChilds: Joi.array()
      .items(Joi.objectId())
      .unique()
  },

  secteurChildLidt: {
    params: {
      themeId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  removeSecteur: {
    params: {
      themeId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // POST /v1/themes
  create: {
    body: {
      parentId: Joi.objectId().allow(null),
      title: Joi.string()
        .min(3)
        .max(250)
        .required(),
      description: Joi.string()
        .min(3)
        .required(),
      type: Joi.string()
        .valid(Theme.types)
        .required()
    }
  },

  // PATCH /v1/themes/:themeId
  update: {
    body: {
      parentId: Joi.objectId().allow(null),
      title: Joi.string()
        .min(3)
        .max(250)
        .required(),
      description: Joi.string().min(3),
      type: Joi.string()
        .valid(Theme.types)
        .required(),
      activities: Joi.array()
        .items(Joi.objectId())
        .unique()
    }
  }
};
