const Joi = require('joi');

module.exports = {
  // GET /v1/themes
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty('')
    }
  },

  // GET /v1/jobs/myJobs
  myJob: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty(''),
      parcourId: Joi.objectId().required()
    }
  },

  // POST /v1/themes
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(250)
        .required(),
      description: Joi.string()
        .min(3)
        .max(250)
        .required(),
      secteur: Joi.array()
        .items(Joi.objectId())
        .unique(),
      interests: Joi.array().items({
        _id: Joi.objectId().required(),
        weight: Joi.number()
          .min(0)
          .max(1)
          .required()
      }),
      competences: Joi.array().items({
        _id: Joi.objectId().required(),
        weight: Joi.number()
          .min(0)
          .max(1)
          .required()
      }),
      formations: Joi.array()
        .items(Joi.objectId())
        .unique()
    }
  },

  // PATCH /v1/themes/:themeId
  update: {
    body: {
      title: Joi.string()
        .min(3)
        .max(250)
        .required(),
      description: Joi.string()
        .min(3)
        .max(250)
        .required(),
      secteur: Joi.array()
        .items(Joi.objectId())
        .unique(),
      interests: Joi.array().items({
        _id: Joi.objectId().required(),
        weight: Joi.number()
          .min(0)
          .max(1)
          .required()
      }),
      competences: Joi.array().items({
        _id: Joi.objectId().required(),
        weight: Joi.number()
          .min(0)
          .max(1)
          .required()
      }),
      formations: Joi.array()
        .items(Joi.objectId())
        .unique()
    }
  }
};
