const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/interest
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty('')
    }
  },
  // patch /v1/interest/:id
  update: {
    body: {
      nom: Joi.string()
        .max(250)
        .required(),
      interests: Joi.array()
        .items(Joi.objectId())
        .unique()
    }
  },

  removeResources: {
    body: {
      resource: Joi.objectId()
    }
  },

  // post /v1/interest
  create: {
    body: {
      nom: Joi.string()
        .max(250)
        .required(),
      interests: Joi.array()
        .items(Joi.objectId())
        .unique()
    }
  }
};
