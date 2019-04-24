/* eslint-disable consistent-return */
const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Parcour = require('../models/parcour.model');
const User = require('../models/user.model');
const { addGlobals } = require('../middlewares/addGlobals');
const { omit, pick } = require('lodash');
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
exports.get = async (req, res, next) => {
  try {
    const { parcour } = req.locals;
    const globalParcour = await addGlobals(parcour);
    return res.json(globalParcour.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Create new parcour
 * @public
 */
exports.create = async (req, res, next) => {
  const { user } = req;
  try {
    let parcourResponse = null;

    const userParcour = await Parcour.findOne({ userId: user._id });

    if (userParcour) {
      parcourResponse = userParcour;

      res.status(httpStatus.OK);
    } else {
      const parcour = new Parcour({ userId: user._id, ...req.body });

      parcourResponse = await parcour.save();
      res.status(httpStatus.CREATED);
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
    const newParcour = omit(req.body, ['_id', 'userId', 'advisorId']);
    const updatedParcour = Object.assign(parcour, newParcour);
    const savedParcour = await updatedParcour.save();
    res.json(savedParcour.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * add families to Parcour
 * @public
 */

exports.addFamilies = async (req, res, next) => {
  const { parcour } = req.locals;
  try {
    const newParcour = pick(req.body, ['families']);
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
    await User.findOneAndUpdate(
      { _id: parcour.userId },
      {
        $pull: { parcours: parcour._id }
      }
    );
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

    const RolesSearch = {
      admin: {},
      advisor: { advisorId: _id },
      user: { userId: _id }
    };

    const querySearch = { ...RolesSearch[role] };

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
