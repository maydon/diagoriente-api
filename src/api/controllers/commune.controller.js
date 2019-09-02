const { pagination } = require('../utils/Pagination');
const Commune = require('../models/communeINSEE.model');
const { handler: errorHandler } = require('../middlewares/error');

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
exports.get = (req, res) => res.json(req.locals.commune.transform());

exports.list = async (req, res, next) => {
  try {
    const communes = await Commune.list(req.query);
    const transformedActivity = communes.map((commune) => commune.transform());
    const reg = new RegExp(req.query.search, 'i');
    const reg1 = new RegExp(req.query.type, 'i');

    const querySearch = { $or: [{ title: reg }, { search: reg }], type: reg1 };
    const responstPagination = await pagination(
      transformedActivity,
      req.query,
      Commune,
      querySearch
    );
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
