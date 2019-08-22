const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/questionJob.controller');
const {
  authorize, ADVISOR, ADMIN, LOGGED_USER
} = require('../../middlewares/auth');
const { list, update, create } = require('../../validations/questionJob.validation');

const router = express.Router();

router.param('questionJobId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/questionJobs List QuestionJobs
   * @apiDescription Get a list of QuestionJobs
   * @apiVersion 1.0.0
   * @apiName ListQuestionJobs
   * @apiGroup QuestionJob
   * @apiPermission admin / user / advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  questionJob's per page
   * @apiParam  {String}  search      search param
   * @apiParam  {ObjectId}            jobId     Job's id
   *
   * @apiSuccess {Object[]}   List of QuestionJobs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list)
  /**
   * @api {post} v1/questionJobs Create QuestionJobs
   * @apiDescription Create a new of QuestionJobs
   * @apiVersion 1.0.0
   * @apiName CreateQuestionJobs
   * @apiGroup QuestionJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            label     QuestionJob's label
   * @apiParam  {ObjectId}            jobId     Job's id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   QuestionJob object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:questionJobId')
  /**
   * @api {get} v1/questionJobs/:id patch QuestionJobs
   * @apiDescription Get questionJobs information
   * @apiVersion 1.0.0
   * @apiName GetIQuestionJob
   * @apiGroup QuestionJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            id     QuestionJob id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize([LOGGED_USER, ADVISOR]), controller.get)
  /**
   * @api {get} v1/questionJobs/:id patch QuestionJobs
   * @apiDescription Get questionJobs information
   * @apiVersion 1.0.0
   * @apiName GetIQuestionJobs
   * @apiGroup QuestionJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            label     QuestionJob's label
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {get} v1/questionJobs/:id Delete questionJob
   * @apiDescription Delete questionJob information
   * @apiVersion 1.0.0
   * @apiName GetQuestionJobs
   * @apiGroup QuestionJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id questionJob
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
