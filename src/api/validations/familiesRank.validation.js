const Joi = require('../utils/myJoi');

module.exports = {
  // GET /v1/interest
  list: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number()
        .min(1)
        .max(100)
    }
  },
  // patch /v1/interest/:id
  update: {
    body: {
      familiesRank: Joi.array()
        .max(5)
        .items({
          rank: Joi.number()
            .min(1)
            .max(5)
            .required(),
          pExpInt: Joi.number()
            .min(0)
            .max(2)
            .required()
        })
    }
  }
};
