const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Context = require('../models/context.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load context and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const context = await Context.get(id);
    req.locals = { context };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get context
 * @public
 */
exports.get = (req, res) => res.json(req.locals.context.transform());

/**
 * Create new context
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const context = new Context(req.body);
    const savedContext = await context.save();
    res.status(httpStatus.CREATED);
    res.json(savedContext.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  context
 * @public
 */
exports.update = async (req, res, next) => {
  const { context } = req.locals;
  try {
    const newContext = omit(req.body, '_id');
    const updatedContext = Object.assign(context, newContext);
    const savedContext = await updatedContext.save();
    res.json(savedContext.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete context
 * @public
 */
exports.remove = async (req, res, next) => {
  const { context } = req.locals;
  try {
    context
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get contexts list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const contexts = await Context.list(req.query);
    const transformedContext = contexts.map((context) => context.transform());
    const reg = new RegExp(req.query.search, 'i');

    const querySearch = { title: reg };
    const responstPagination = await pagination(
      transformedContext,
      req.query,
      Context,
      querySearch
    );
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
