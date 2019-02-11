const httpStatus = require('http-status');
const Theme = require('../models/theme.model');
const { pagination } = require('../utils/Pagination');
const { normalize } = require('../utils/Normalize');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');
const { serverUrl } = require('../../config/vars');

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
    const { title, description } = req.body;
    req.body.search = normalize([title, description]);
    const newTheme = omit(req.body, 'resources');
    const theme = new Theme(newTheme);
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
    const { title, description } = req.body;
    req.body.search = normalize([title, description]);
    const newTheme = omit(req.body, '_id', 'resources');
    const updatedTheme = Object.assign(theme, newTheme);
    const savedpost = await updatedTheme.save();
    res.json(savedpost.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Create icon theme
 * @public
 */
exports.upload = async (req, res, next) => {
  try {
    const { file } = req;
    const { color, backgroundColor } = req.body;

    const { theme } = req.locals;
    const { resources } = theme;

    if (color) resources.color = color;
    if (backgroundColor) resources.backgroundColor = backgroundColor;
    if (file) {
      resources.icon = `${serverUrl}/v1/icons/${file.filename}`;
    }

    theme.set({ resources });
    const savedTheme = await theme.save();
    res.json(savedTheme.transform());
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
  const { role } = req.user;
  const { path } = req.route;

  /*
   * populate if path = /all
   */
  const population = path !== '/';

  try {
    const themes = await Theme.list({ ...req.query, role, population });
    const transformedThemes = themes.map((theme) => theme.transform());

    const reg = new RegExp(req.query.search, 'i');
    const reg1 = new RegExp(req.query.type, 'i');
    const verified = role === 'admin' ? {} : { verified: true };

    const querySearch = {
      $or: [{ title: reg }, { description: reg }, { search: reg }],
      type: reg1,
      ...verified
    };

    const responstPagination = await pagination(
      transformedThemes,
      req.query,
      Theme,
      querySearch
    );

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get secteur child list
 * @public
 */
exports.secteurChildList = async (req, res, next) => {
  try {
    const { themeId: parentId } = req.params;

    const secteurs = await Theme.listSecteur({ parentId });
    const transformedSecteurs = secteurs.map((theme) => theme.transform());

    const responstPagination = await pagination(
      transformedSecteurs,
      req.query,
      Theme,
      null
    );

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Secteur and
 * set ro null all
 * themes contains
 * secteur id
 * @public
 */
exports.removeSecteur = async (req, res, next) => {
  const { theme: secteur } = req.locals;

  try {
    const updateChilds = await Theme.updateMany(
      { parentId: secteur._id },
      { $set: { parentId: null } }
    );

    const removeSector = await secteur.remove();

    await Promise.all([removeSector, updateChilds]);

    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
