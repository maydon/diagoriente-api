const Interest = require('../models/interest.model');
const { omit } = require('lodash');
const { pagination } = require('../utils/Pagination');
const httpStatus = require('http-status');

const { handler: errorHandler } = require('../middlewares/error');

/**
 * Get intersest
 * @public
 */
exports.get = (req, res) => res.json(req.locals.interest.transform());

/**
 * Load interst and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const interest = await Interest.get(id);
    req.locals = { interest };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
/**
 * Update(patch) interest
 * @public
 */

exports.update = async (req, res, next) => {
  const { interest } = req.locals;

  try {
    const newInterest = omit(req.body, '_id');
    const updatedInterest = Object.assign(interest, newInterest);
    const savedInterest = await updatedInterest.save();
    res.json(savedInterest.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * List interest
 * @public
 */

exports.list = async (req, res, next) => {
  try {
    const interests = await Interest.list(req.query);
    const transformedInterest = interests.map((interest) =>
      interest.transform()
    );
    const reg = new RegExp(req.query.search, 'i');
    const querySearch = { $or: [{ nom: reg }, { rank: reg }] };
    const responstPagination = await pagination(
      transformedInterest,
      req.query,
      Interest,
      querySearch
    );

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Create interest
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const interest = new Interest(req.body);
    const savedInterest = await interest.save();
    res.status(httpStatus.CREATED);
    res.json(savedInterest.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete interest
 * @public
 */
exports.remove = async (req, res, next) => {
  const { interest } = req.locals;

  try {
    interest
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};
