const httpStatus = require('http-status');
const Job = require('../models/job.model');
const Parcour = require('../models/parcour.model');
const { pagination } = require('../utils/Pagination');
const { addGlobals } = require('../middlewares/addGlobals');
const { normalize } = require('../utils/Normalize');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const job = await Job.get(id);
    req.locals = { job };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get theme
 * @public
 */
exports.get = (req, res) => res.json(req.locals.job.transform());

/**
 * Create new theme
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    req.body.search = normalize([title, description]);
    const job = new Job(req.body);
    const savedJob = await job.save();
    res.status(httpStatus.CREATED);
    res.json(savedJob.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  theme
 * @public
 */
exports.update = async (req, res, next) => {
  const { job } = req.locals;

  try {
    const { title, description } = req.body;
    req.body.search = normalize([title, description]);
    const newJob = omit(req.body, '_id');
    const updatedJob = Object.assign(job, newJob);
    const savedJob = await updatedJob.save();
    res.json(savedJob.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Post
 * @public
 */
exports.remove = async (req, res, next) => {
  const { job } = req.locals;

  try {
    job
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
    const jobs = await Job.list(req.query);
    const transformedJobd = jobs.map((job) => job.transform());

    const responsePagination = await pagination(
      transformedJobd,
      req.query,
      Job,
      {} //query search params
    );

    res.json(responsePagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get myJobs recomandation
 * @public
 */

exports.myJob = async (req, res, next) => {
  try {
    const { parcourId } = req.query;

    const parcour = await Parcour.findById(parcourId);
    if (!parcour) {
      Parcour.parcourDosentExist(parcourId);
    }

    const globalParcour = await addGlobals(parcour);

    const globalInterest = globalParcour.globalInterest.map((item) => item._id);

    /* suspectJobs contain jobs list that's */
    /* contain least one interest form selected parcour */

    const suspectJobs = await Job.find({
      'interests._id': { $in: globalInterest }
    });

    console.log('suspectJobs', suspectJobs);

    //return res.json(globalParcour.transform());
  } catch (error) {
    next(error);
  }
};
