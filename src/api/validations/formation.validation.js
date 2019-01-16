const Joi = require('joi');
const Theme = require('../models/theme.model');

module.exports = {
  // GET /v1/formations
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      search: Joi.string().empty('')
    }
  },

  // POST /v1/formations
  create: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      description: Joi.string()
        .min(3)
        .max(120)
        .required(),
      establishment: Joi.string().required(),
      adress: {
        adress: Joi.string()
          .min(3)
          .max(20)
      },
      postalCode: Joi.string().max(8),
      country: Joi.string().max(20)
    },
    contact: {
      email: Joi.string().email(),
      webAdress: Joi.string().max(30),
      phone: Joi.string().max(20)
    }
  },
  // PATCH /v1/formations/:formationsId
  update: {
    body: {
      title: Joi.string()
        .min(3)
        .max(20)
        .required(),
      description: Joi.string()
        .min(3)
        .max(120)
        .required(),
      establishment: Joi.string().required(),
      adress: {
        adress: Joi.string()
          .min(3)
          .max(20)
      },
      postalCode: Joi.string().max(8),
      country: Joi.string().max(20)
    },
    contact: {
      email: Joi.string().email(),
      webAdress: Joi.string().max(30),
      phone: Joi.string().max(20)
    }
  }
};
