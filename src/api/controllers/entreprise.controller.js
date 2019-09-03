const Entreprise = require('../models/entreprise.model');
const { handler: errorHandler } = require('../middlewares/error');
const axios = require('axios');
/**
 * Load activity and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const entreprise = await Entreprise.get(id);

    req.locals = { entreprise };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.list = async (req, res, next) => {
  try {
    const entreprises = await Entreprise.list({ ...req.query });
    axios
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then((json) => console.log(json));

    const transformedEntreprises = entreprises.map((com) => com.transform());

    res.json(transformedEntreprises);
  } catch (error) {
    next(error);
  }
};
