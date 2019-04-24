const httpStatus = require('http-status');
const Competence = require('../models/competence.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load competences and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const competence = await Competence.get(id);
    req.locals = { competence };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get competences
 * @public
 */
exports.get = (req, res) => res.json(req.locals.competence.transform());

/**
 * Create new competences
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const competence = new Competence(req.body);
    const savedCompetence = await competence.save();
    res.status(httpStatus.CREATED);
    res.json(savedCompetence.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  competence
 * @public
 */
exports.update = async (req, res, next) => {
  const { competence } = req.locals;
  try {
    const newCompetence = omit(req.body, '_id');
    const updatedCompetence = Object.assign(competence, newCompetence);
    const savedCompetence = await updatedCompetence.save();
    res.json(savedCompetence.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete competence
 * @public
 */
exports.remove = async (req, res, next) => {
  const { competence } = req.locals;
  try {
    competence
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get competences list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const competences = await Competence.list(req.query);
    const transformedCompetences = competences.map((competence) => competence.transform());
    res.json(transformedCompetences);
  } catch (error) {
    next(error);
  }
};
