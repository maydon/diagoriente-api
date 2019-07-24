const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Environment = require('../models/environment.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load environment and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const environment = await Environment.get(id);
    req.locals = { environment };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get environment
 * @public
 */
exports.get = (req, res) => res.json(req.locals.environment.transform());

/**
 * Create new environment
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const environment = new Environment(req.body);
    const savedEnvironment = await environment.save();
    res.status(httpStatus.CREATED);
    res.json(savedEnvironment.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  environment
 * @public
 */
exports.update = async (req, res, next) => {
  const { environment } = req.locals;
  try {
    const newEnvironment = omit(req.body, '_id');
    const updatedEnvironment = Object.assign(environment, newEnvironment);
    const savedEnvironment = await updatedEnvironment.save();
    res.json(savedEnvironment.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete environment
 * @public
 */
exports.remove = async (req, res, next) => {
  const { environment } = req.locals;
  try {
    environment
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get environments list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const environments = await Environment.list(req.query);
    const transformedEnvironment = environments.map((environment) => environment.transform());
    const reg = new RegExp(req.query.search, 'i');

    const querySearch = { title: reg };
    const responstPagination = await pagination(
      transformedEnvironment,
      req.query,
      Environment,
      querySearch
    );
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
