const Commune = require('../models/communeINSEE.model');
const { handler: errorHandler } = require('../middlewares/error');
const { pagination } = require('../utils/Pagination');

/**
 * Load activity and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const commune = await Commune.get(id);

    req.locals = { commune };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { search } = req.query;
    const communes = await Commune.list({ ...req.query });
    const transformedCommunes = communes.map((com) => com.transform());
    const reg = new RegExp(search, 'i');
    const querySearch = {
      $or: [{ Code_commune_INSEE: reg }, { search: reg }]
    };

    const responsePagination = await pagination(
      transformedCommunes,
      req.query,
      Commune,
      querySearch
    );

    res.json(responsePagination);
  } catch (error) {
    next(error);
  }
};
