const httpStatus = require('http-status');
const Question = require('../models/question.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load question and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const question = await Question.get(id);
    req.locals = { question };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get question
 * @public
 */
exports.get = (req, res) => res.json(req.locals.question.transform());

exports.create = async (req, res, next) => {
  try {
    const question = new Question(req.body);

    const savedQuestion = await question.save();
    res.status(httpStatus.CREATED);
    res.json(savedQuestion.transform());
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
    const questions = await Question.list(req.query);
    const transformedquestions = questions.map((rank) => rank.transform());

    res.json(transformedquestions);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete question and append to req.
 * @public
 */
exports.remove = async (req, res, next) => {
  const { question } = req.locals;
  try {
    question
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};
