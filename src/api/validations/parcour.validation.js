const Joi = require('joi');

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

  // get /v1/parcours/:id
  get: {
    params: {
      parcourId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
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
