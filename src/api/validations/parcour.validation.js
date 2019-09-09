const Joi = require('../utils/myJoi');
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
      played: Joi.boolean(),
      families: Joi.array()
        .items(Joi.objectId())
        .unique(),
      skills: Joi.array().items(Joi.object({
        type: Joi.string().valid(Theme.types),
        theme: Joi.objectId(),
        activities: Joi.array().items(Joi.objectId()),
        competences: Joi.array().items({
          _id: Joi.objectId().required(),
          value: Joi.number()
            .min(1)
            .max(5)
        })
      }))
    }
  },

  updateCompetences: {
    body: {
      competences: Joi.array()
        .items({
          _id: Joi.objectId().required(),
          value: Joi.number()
            .min(0)
            .max(4)
        })
        .default([])
    }
  },

  // get /v1/parcours/:id
  get: {
    query: {
      type: Joi.string()
        .valid(Theme.types)
        .default('personal')
    },
    params: {
      parcourId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  getByUser: {
    query: {
      type: Joi.string()
        .valid(Theme.types)
        .default('personal')
    },
    params: {
      userId: Joi.string()
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
