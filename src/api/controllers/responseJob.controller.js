const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const ResponseJob = require('../models/responseJob.model');
const QuestionJob = require('../models/questionJob.model');
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
    const { user } = req;
    const { response, questionJobId, jobId } = req.body;
    const responseBody = { response, questionJobId, jobId };
    responseBody.userId = user._id;
    const questionJob = await QuestionJob.findById(questionJobId);
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
