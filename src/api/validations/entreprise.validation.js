const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/communes
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  }
};
