const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/groupe
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },
  get: {
    params: {
      groupeId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },
  listByAdvisor: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    },
    params: {
      advisorId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
    }
  },

  // POST /v1/groupe
  create: {
    body: {
      advisorId: Joi.string().required(),
      title: Joi.string()
        .min(3)
        .max(250)
        .required(),
      users: Joi.array(),
      code: Joi.string()
        .max(6)
        .required()
    }
  },

  // PATCH /v1/groupe
  update: {
    body: {
      title: Joi.string().min(3),
      users: Joi.array()
    }
  }
};
