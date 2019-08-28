const Joi = require('../utils/myJoi');
const Job = require('../models/job.model');

module.exports = {
  get: {
    query: {
      parcourId: Joi.objectId()
    }
  },
  // GET /v1/themes
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty(''),
      environments: Joi.string().allow(''),
      secteur: Joi.string().allow('')
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
      parcourId: Joi.objectId().required(),
      algoType: Joi.string()
        .valid(Job.ALGO_TYPE)
        .default('interest'),
      environments: Joi.string().allow(''),
      secteur: Joi.string().allow('')
    }
  },

  // POST /v1/themes
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(500)
        .required(),
      description: Joi.string()
        .min(3)
        .max(1000)
        .required(),
      secteur: Joi.array()
        .items(Joi.objectId())
        .unique(),
      accessibility: Joi.string().max(50),
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
          .max(4)
          .required()
      }),
      formations: Joi.array()
        .items(Joi.objectId())
        .unique(),
      environments: Joi.array()
        .items(Joi.objectId())
        .unique(),
      link: Joi.string().max(500)
    }
  },

  // PATCH /v1/themes/:themeId
  update: {
    body: {
      title: Joi.string()
        .min(3)
        .max(500),
      description: Joi.string()
        .min(3)
        .max(1000),
      secteur: Joi.array()
        .items(Joi.objectId())
        .unique(),
      accessibility: Joi.string().max(50),
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
          .max(4)
          .required()
      }),
      formations: Joi.array()
        .items(Joi.objectId())
        .unique(),
      environments: Joi.array()
        .items(Joi.objectId())
        .unique(),
      link: Joi.string().max(500),
      questionJobs: Joi.array()
        .items({
          _id: Joi.string().allow(null),
          label: Joi.string()
            .max(250)
            .required()
        })
        .max(10)
    }
  }
};
