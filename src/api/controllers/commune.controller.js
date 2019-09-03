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

exports.list = async (req, res, next) => {
  try {
    const commune = await Commune.list(req.query);
    const transformedCommunes = commune.map((com) => com.transform());
    res.json(transformedCommunes);
  } catch (error) {
    next(error);
  }
};
