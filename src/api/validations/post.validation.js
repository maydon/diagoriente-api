const Joi = require('joi');

module.exports = {
  // GET /v1/posts
  listPosts: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100),
      name: Joi.string(),
    },
  },

  // POST /v1/posts
  createPost: {
    body: {
      id_user: Joi.string()
        .min(3)
        .required(),
      id_parent: Joi.string()
        .min(3)
        .required(),
      id_caregories: Joi.string()
        .min(1)
        .required(),
      name: Joi.string()
        .max(50)
        .required(),
      description: Joi.string().max(128),
    },
  },
};
