const Entreprise = require('../models/entreprise.model');
const { handler: errorHandler } = require('../middlewares/error');
const axios = require('axios');
const { GenerateToken } = require('../utils/GenerateToken');
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
    const entreprises = req.query;
    console.log('tessst ', entreprises);

    const token = await GenerateToken();
    await axios
      .get(
        `https://api.emploi-store.fr/partenaire/labonneboite/v1/company/?distance=${entreprises.distance}&latitude=${entreprises.latitude}&longitude=${entreprises.longitude}&rome_codes_keyword_search=${entreprises.rome_codes_keyword_search}`,
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        }
      )
      .then((response) => {
        const transformedEntreprises = response.data.companies;
        res.json(transformedEntreprises);
      })
      .catch((error) => console.log(error.response));
  } catch (error) {
    next(error);
  }
};
