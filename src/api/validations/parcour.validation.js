const Joi = require('joi');
const Theme = require('../models/theme.model');

module.exports = {
  // GET /v1/parcours
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },

  // POST /v1/parcours
  create: {
    body: {
      advisorId: Joi.objectId(),
      skills: Joi.array()
        .items(Joi.objectId())
        .unique(),
      completed: Joi.boolean()
    }
  },
  update: { 

    body: {
      skills: Joi.array().items(Joi.object({

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
      }) )

    }

  },

  // get /v1/parcours/:id
  get: {
    params: {
      parcourId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  addFamilies: {
    params: {
      parcourId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    },
    body: {
      families: Joi.array()
        .items(Joi.objectId())
        .unique()
    }
  },

  deleteParcour: {
    params: {
      parcourId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  }
};
