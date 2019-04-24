const httpStatus = require('http-status');
const Theme = require('../models/theme.model');
const Interest = require('../models/interest.model');
const { pagination } = require('../utils/Pagination');
const { importFormater } = require('../utils/Import');
const { normalize } = require('../utils/Normalize');
const { omit, map, difference } = require('lodash');
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
  try {
    const { role } = req.user;
    const { path } = req.route;
    const { search, type } = req.query;
    /*
     * populate if path = /all
     */
    const population = path !== '/';
    const themes = await Theme.list({ ...req.query, role, population });
    const transformedThemes = themes.map((theme) => theme.transform());
    const reg = new RegExp(search, 'i');
    const reg1 = new RegExp(type, 'i');
    const reg2 = { $in: ['professional', 'personal'] };
    const verified = role === 'admin' ? {} : { verified: true };

    const querySearch = {
      $or: [{ title: reg }, { description: reg }, { search: reg }],
      type: type ? reg1 : reg2,
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
    const { theme: secteur } = req.locals;

    const { themeId: parentId } = req.params;

    const secteurs = await Theme.listSecteur({ parentId });
    const transformedSecteurs = secteurs.map((theme) => theme.transform());

    const responstPagination = await pagination(
      transformedSecteurs,
      req.query,
      Theme,
      null
    );

    responstPagination.secteur = secteur.transform();

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};

/**
 * create secteur
 * @public
 */

exports.createSecteur = async (req, res, next) => {
  try {
    const { title, description, secteurChilds } = req.body;

    req.body.type = 'secteur';
    req.body.search = normalize([title, description]);
    req.body.activities = null;
    req.body.parentId = null;

    const newSecteur = omit(req.body, 'resources');
    const secteur = new Theme(newSecteur);

    const updateChilds = await Theme.updateMany(
      { _id: { $in: secteurChilds } },
      { $set: { parentId: secteur._id } }
    );

    const savedSecteur = await secteur.save();
    await Promise.all([updateChilds, savedSecteur]);

    res.status(httpStatus.CREATED);
    res.json(savedSecteur.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * update secteur
 * @public
 */

exports.updateSecteur = async (req, res, next) => {
  try {
    const { title, description, secteurChilds } = req.body;
    const { theme: secteur } = req.locals;

    secteur.search = normalize([title, description]);

    // we should set to null unavailable id theme
    const recentUpdatedChilds = map(
      await Theme.find({ parentId: secteur._id }),
      (item) => item._id.toString()
    );

    const addParentId = difference(secteurChilds, recentUpdatedChilds);
    const removeParentId = difference(recentUpdatedChilds, secteurChilds);

    const setRecentsChilds = await Theme.updateMany(
      { _id: { $in: removeParentId } },
      { $set: { parentId: null } }
    );

    const updateChilds = await Theme.updateMany(
      { _id: { $in: addParentId } },
      { $set: { parentId: secteur._id } }
    );

    const newSecteur = omit(req.body, [
      'resources',
      'type',
      'activities',
      'parentId'
    ]);

    const updatedSecteur = Object.assign(secteur, newSecteur);

    const savedSecteur = await updatedSecteur.save();
    await Promise.all([setRecentsChilds, updateChilds, savedSecteur]);

    res.json(savedSecteur.transform());
  } catch (e) {
    next(e);
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

/**
 * import new
 * theme file
 *
 * @public
 */

exports.uploadTheme = async (req, res, next) => {
  const { file } = req;

  try {
    const fileContent = file.buffer.toString('utf8').trim();
    const interrestRankList = await Interest.listRank();
    const interrestRankObject = await Interest.objectListRank(interrestRankList);

    const formatedContent = importFormater(fileContent.split('\r\n'), interrestRankObject);
    const importedThemes = await Theme.importThemes(formatedContent);
    console.log('importedThemes', importedThemes);
    res.json(importedThemes);
  } catch (error) {
    next(error);
  }
};
