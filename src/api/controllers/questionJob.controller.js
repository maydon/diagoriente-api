const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const QuestionJob = require('../models/questionJob.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load questionJob and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const questionJob = await QuestionJob.get(id);
    req.locals = { questionJob };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get questionJob
 * @public
 */
exports.get = (req, res) => res.json(req.locals.questionJob.transform());

/**
 * Create new questionJob
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const questionJob = new QuestionJob(req.body);
    const savedQuestionJob = await questionJob.save();
    res.status(httpStatus.CREATED);
    res.json(savedQuestionJob.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  questionJob
 * @public
 */
exports.update = async (req, res, next) => {
  const { questionJob } = req.locals;
  try {
    const newQuestionJob = omit(req.body, '_id');
    const updatedQuestionJob = Object.assign(questionJob, newQuestionJob);
    const savedQuestionJob = await updatedQuestionJob.save();
    res.json(savedQuestionJob.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete questionJob
 * @public
 */
exports.remove = async (req, res, next) => {
  const { questionJob } = req.locals;
  try {
    questionJob
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get questionJobs list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const questionJobs = await QuestionJob.list(req.query);
    const transformedQuestionJob = questionJobs.map((questionJob) => questionJob.transform());
    const reg = new RegExp(req.query.search, 'i');

    const querySearch = {
      $and: [{ label: reg }]
    };
    if (req.query.jobId !== undefined) querySearch.$and.push({ jobId: req.query.jobId });
    const responstPagination = await pagination(
      transformedQuestionJob,
      req.query,
      QuestionJob,
      querySearch
    );
    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
