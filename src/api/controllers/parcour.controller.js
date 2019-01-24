const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Parcour = require('../models/parcour.model');
const User = require('../models/user.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load parcour and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const parcour = await Parcour.get(id);
    req.locals = { parcour };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get parcour
 * @public
 */
exports.get = (req, res) => res.json(req.locals.parcour.transform());

/**
 * Create new parcour
 * @public
 */
exports.create = async (req, res, next) => {
  const { user } = req;
  try {
    let parcourResponse = null;
    if (user.parcours.length === 0) {
      const parcour = new Parcour({ userId: user._id, ...req.body });
      parcourResponse = await parcour.save();
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $push: { parcours: parcourResponse._id }
        }
      );
      res.status(httpStatus.CREATED);
    } else {
      parcourResponse = await Parcour.get(user.parcours[0]);
      res.status(httpStatus.OK);
    }

    res.json(parcourResponse.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  parcour
 * @public
 */
exports.update = async (req, res, next) => {
  const { parcour } = req.locals;
  try {
    const newParcour = omit(req.body, '_id');
    const updatedParcour = Object.assign(parcour, newParcour);
    const savedParcour = await updatedParcour.save();
    res.json(savedParcour.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete parcour
 * @public
 */
exports.remove = async (req, res, next) => {
  const { parcour } = req.locals;
  try {
    parcour
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get parcours list
 * @public
 */
exports.list = async (req, res, next) => {
  const { role, _id } = req.user;
  try {
    const parcours = await Parcour.list({
      ...req.query,
      role,
      _id
    });
    const transformedParcours = parcours.map((parcour) => parcour.transform());
    const userId = role === 'admin' ? {} : { userId: _id };
    const querySearch = { ...userId };

    const responstPagination = await pagination(
      transformedParcours,
      req.query,
      Parcour,
      querySearch
    );

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
