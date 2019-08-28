const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const ResponseJob = require('../models/responseJob.model');
const Parcour = require('../models/parcour.model');
const Job = require('../models/job.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');
const APIError = require('../utils/APIError');

/**
 * Load responseJob and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const responseJob = await ResponseJob.get(id);
    req.locals = { responseJob };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.loadJob = async (req, res, next, id) => {
  try {
    const job = await Job.get(id);
    req.locals = { job };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get responseJob
 * @public
 */
exports.get = (req, res) => res.json(req.locals.responseJob.transform());

/**
 * Create new responseJob
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const {
      response, questionJobId, jobId, parcourId
    } = req.body;
    const parcour = await Parcour.get(parcourId);
    if (!parcour) {
      throw new APIError({
        message: 'parcours does not exist',
        status: httpStatus.NOT_FOUND
      });
    }
    const job = await Job.get(jobId);
    if (!job) {
      throw new APIError({
        message: 'Job does not exist',
        status: httpStatus.NOT_FOUND
      });
    }
    const responseBody = {
      response,
      questionJobId,
      jobId,
      parcourId
    };
    const questionJob = job.questionJobs.id(questionJobId);
    if (!questionJob) {
      throw new APIError({
        message: 'Question does not exist',
        status: httpStatus.NOT_FOUND
      });
    }
    responseBody.questionJobLabel = questionJob.label;
    const responseJob = new ResponseJob(responseBody);
    const savedResponseJob = await responseJob.save();
    res.status(httpStatus.CREATED);
    res.json(savedResponseJob.transform());
  } catch (error) {
    next(error);
  }
};

exports.updateMany = async (req, res, next) => {
  try {
    const result = [];
    const { responses, jobId, parcourId } = req.body;
    const parcour = await Parcour.get(parcourId);
    if (!parcour) {
      throw new APIError({
        message: 'parcours does not exist',
        status: httpStatus.NOT_FOUND
      });
    }
    const job = await Job.get(jobId);
    if (!job) {
      throw new APIError({
        message: 'Job does not exist',
        status: httpStatus.NOT_FOUND
      });
    }
    for (let i = 0; i < responses.length; i++) {
      const responseBody = responses[i];
      const { response, questionJobId } = responseBody;

      const questionJob = job.questionJobs.id(questionJobId);
      if (!questionJob) {
        throw new APIError({
          message: `Question with id ${questionJobId} does not exist`,
          status: httpStatus.NOT_FOUND
        });
      }
      // eslint-disable-next-line no-await-in-loop
      const responseJob = await ResponseJob.findOne({ parcourId, jobId, questionJobId });
      if (responseJob) {
        const newResponseJob = { response, questionJobLabel: questionJob.label };
        const updatedResponseJob = Object.assign(responseJob, newResponseJob);
        // eslint-disable-next-line no-await-in-loop
        const savedResponseJob = await updatedResponseJob.save();
        result.push(savedResponseJob.transform());
      } else {
        const responseObj = {
          response,
          questionJobId,
          jobId,
          parcourId
        };
        responseObj.questionJobLabel = questionJob.label;
        const newResponseJob = new ResponseJob(responseObj);
        // eslint-disable-next-line no-await-in-loop
        const savedResponseJob = await newResponseJob.save();
        result.push(savedResponseJob.transform());
      }
    }
    res.status(httpStatus.CREATED);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
/**
 * Update  responseJob
 * @public
 */
exports.update = async (req, res, next) => {
  const { responseJob } = req.locals;
  try {
    const newResponseJob = omit(req.body, '_id');
    const updatedResponseJob = Object.assign(responseJob, newResponseJob);
    const savedResponseJob = await updatedResponseJob.save();
    res.json(savedResponseJob.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete responseJob
 * @public
 */
exports.remove = async (req, res, next) => {
  const { responseJob } = req.locals;
  try {
    responseJob
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get responseJobs list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const responseJobs = await ResponseJob.list(req.query);
    const transformedResponseJob = responseJobs.map((responseJob) => responseJob.transform());

    const responstPagination = await pagination(transformedResponseJob, req.query, ResponseJob, {});
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
