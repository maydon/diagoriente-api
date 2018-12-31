const httpStatus = require('http-status');
const Theme = require('../models/theme.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const theme = await Theme.get(id);
    req.locals = { theme };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get theme
 * @public
 */
exports.get = (req, res) => res.json(req.locals.theme.transform());

/**
 * Create new theme
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const theme = new Theme(req.body);
    const savedTheme = await theme.save();
    res.status(httpStatus.CREATED);
    res.json(savedTheme.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  theme
 * @public
 */
exports.update = async (req, res, next) => {
  const { theme } = req.locals;

  try {
    const newTheme = omit(req.body, '_id');
    const updatedTheme = Object.assign(theme, newTheme);
    const savedpost = await updatedTheme.save();
    res.json(savedpost.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Post
 * @public
 */
exports.remove = async (req, res, next) => {
  const { theme } = req.locals;

  try {
    theme
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get themes list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const themes = await Theme.list(req.query);
    const transformedThemes = themes.map((theme) => theme.transform());
    res.json(transformedThemes);
  } catch (error) {
    next(error);
  }
};
