const Family = require('../models/family.model');
const { omit, pick, random } = require('lodash');
const { pagination } = require('../utils/Pagination');
const httpStatus = require('http-status');

const { handler: errorHandler } = require('../middlewares/error');

/**
 * Get interest
 * @public
 */
exports.get = (req, res) => {
  const { family } = req.locals;
  const randomResources = random(family.resources.length - 1);
  family.resources = family.resources[randomResources];
  res.json(family.transform());
};

/**
 * Load interst and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const family = await Family.get(id);
    req.locals = { family };
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
  const { family } = req.locals;

  try {
    const newFamily = omit(req.body, ['_id']);
    const updatedFamily = Object.assign(family, newFamily);
    const savedFamily = await updatedFamily.save();
    res.json(savedFamily.transform());
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
    const families = await Family.list(req.query);
    const transformedFamilies = families.map((family) => family.transform());
    const reg = new RegExp(req.query.search, 'i');
    const querySearch = { $or: [{ nom: reg }, { rank: reg }] };
    const responstPagination = await pagination(
      transformedFamilies,
      req.query,
      Family,
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
    const family = new Family(req.body);
    const savedFamily = await family.save();
    res.status(httpStatus.CREATED);
    res.json(savedFamily.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Upload family resources
 * @public
 */
exports.addResources = async (req, res, next) => {
  const { family } = req.locals;
  const { files } = req;

  const resources = files.map((item) => {
    return {
      name: item.originalname,
      mimetype: item.mimetype,
      base64: new Buffer(item.buffer, 'binary').toString('base64')
    };
  });

  await Family.update(
    { _id: family._id },
    { $push: { resources: { $each: resources } } }
  );

  const savedFamily = await Family.get(family._id);
  res.json(savedFamily.transform(savedFamily));
};

/**
 * Upload family resources
 * @public
 */
exports.removeResources = async (req, res, next) => {
  const { family } = req.locals;
  console.log(family.resources);
  const { resource } = req.body;

  try {
    await Family.updateOne(
      { _id: family._id },
      { $pull: { resources: { _id: resource } } }
    );
    const savedFamily = await Family.get(family._id);
    res.json(savedFamily.transform(savedFamily));
  } catch (e) {
    next(e);
  }
};

/**
 * Delete interest
 * @public
 */
exports.remove = async (req, res, next) => {
  const { family } = req.locals;

  try {
    family
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};
