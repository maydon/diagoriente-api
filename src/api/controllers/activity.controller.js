const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Activity = require('../models/activity.model');
const { omit } = require('lodash');
const { normalize } = require('../utils/Normalize');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load activity and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const activity = await Activity.get(id);
    req.locals = { activity };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get activity
 * @public
 */
exports.get = (req, res) => res.json(req.locals.activity.transform());

/**
 * Create new activity
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { title } = req.body;
    req.body.search = normalize([title]);
    const activity = new Activity(req.body);
    const savedActivity = await activity.save();
    res.status(httpStatus.CREATED);
    res.json(savedActivity.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  activity
 * @public
 */
exports.update = async (req, res, next) => {
  const { activity } = req.locals;
  try {
    const { title } = req.body;
    req.body.search = normalize([title]);
    const newActivity = omit(req.body, '_id');
    const updatedActivity = Object.assign(activity, newActivity);
    const savedActitvity = await updatedActivity.save();
    res.json(savedActitvity.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete activity
 * @public
 */
exports.remove = async (req, res, next) => {
  const { activity } = req.locals;
  try {
    activity
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get activities list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const actitvities = await Activity.list(req.query);
    const transformedActivity = actitvities.map((actitvity) =>
      actitvity.transform()
    );
    const reg = new RegExp(req.query.search, 'i');
    const reg1 = new RegExp(req.query.type, 'i');

    const querySearch = { $or: [{ title: reg }, { search: reg }], type: reg1 };
    const responstPagination = await pagination(
      transformedActivity,
      req.query,
      Activity,
      querySearch
    );
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
