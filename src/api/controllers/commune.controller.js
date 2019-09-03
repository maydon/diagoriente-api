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

exports.get = (req, res) => {
  res.json(req.locals.commune.transform());
};


exports.list = async (req, res, next) => {
  try {
    const skills = await Commune.list(req.query);
    const transformedSkills = skills.map((skill) => skill.transform());
    res.json(transformedSkills);
  } catch (error) {
    next(error);
  }
};
