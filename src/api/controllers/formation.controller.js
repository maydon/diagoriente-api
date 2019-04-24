const httpStatus = require('http-status');
const Formation = require('../models/formation.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load formation and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const formation = await Formation.get(id);
    req.locals = { formation };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get formation
 * @public
 */
exports.get = (req, res) => res.json(req.locals.formation.transform());

/**
 * Create new formation
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const formation = new Formation(req.body);
    const savedFormation = await formation.save();
    res.status(httpStatus.CREATED);
    res.json(savedFormation.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  formation
 * @public
 */
exports.update = async (req, res, next) => {
  const { formation } = req.locals;

  try {
    const newFormation = omit(req.body, '_id');
    const updatedFormation = Object.assign(formation, newFormation);
    const savedFormation = await updatedFormation.save();
    res.json(savedFormation.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete formation
 * @public
 */
exports.remove = async (req, res, next) => {
  const { formation } = req.locals;

  try {
    formation
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get formations list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const formations = await Formation.list(req.query);
    const transformedFormations = formations.map((formation) =>
      formation.transform());
    res.json(transformedFormations);
  } catch (error) {
    next(error);
  }
};
