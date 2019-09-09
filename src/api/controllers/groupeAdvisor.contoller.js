const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Groupe = require('../models/groupeAdvisor.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load groupe and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const groupe = await Groupe.get(id);
    req.locals = { groupe };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get groupe
 * @public
 */
exports.get = (req, res) => res.json(req.locals.groupe.transform());

/**
 * Create new groupe
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const groupe = new Groupe(req.body);
    const savedGroupe = await groupe.save();
    res.status(httpStatus.CREATED);
    res.json(savedGroupe.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  groupe
 * @public
 */
exports.update = async (req, res, next) => {
  const { groupe } = req.locals;
  try {
    const newGroupe = omit(req.body, '_id');
    const updatedGroupe = Object.assign(groupe, newGroupe);
    const savedGroupe = await updatedGroupe.save();
    res.json(savedGroupe.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete groupe
 * @public
 */
exports.remove = async (req, res, next) => {
  const { groupe } = req.locals;
  try {
    groupe
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get groupes list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const { search } = req.query;
    const groupes = await Groupe.find({ ...req.params });
    console.log(groupes);
    const transformedGroupe = groupes.map((groupe) => groupe.transform());
    const reg = new RegExp(search, 'i');
    const querySearch = {
      $or: [{ search: reg }]
    };
    const responstPagination = await pagination(transformedGroupe, req.query, Groupe, querySearch);
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
