const Favorite = require('../models/favorite.model');
const { omit } = require('lodash');
const { pagination } = require('../utils/Pagination');
const httpStatus = require('http-status');

const { handler: errorHandler } = require('../middlewares/error');

/**
 * Get interest
 * @public
 */
exports.get = (req, res) => res.json(req.locals.favorite.transform());

/**
 * Load interst and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const favorite = await Favorite.get(id);
    req.locals = { favorite };
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
  const { favorite } = req.locals;

  try {
    const newFavorite = omit(req.body, ['_id']);
    const updatedFavorite = Object.assign(favorite, newFavorite);
    const savedFavorite = await updatedFavorite.save();
    res.json(savedFavorite.transform());
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
    const { role, _id } = req.user;

    const search = role === 'user' ? { user: _id } : { user: null };

    const favorites = await Favorite.list({ ...req.query, _id: search.user });
    const transformedFamilies = favorites.map((fav) => fav.transform());
    const querySearch = { ...search };
    const responstPagination = await pagination(
      transformedFamilies,
      req.query,
      Favorite,
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
    const favorite = new Favorite(req.body);
    const savedFavorite = await favorite.save();
    res.status(httpStatus.CREATED);
    res.json(savedFavorite.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete interest
 * @public
 */
exports.remove = async (req, res, next) => {
  const { favorite } = req.locals;

  try {
    favorite
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};
