const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/responseJob.controller');
const {
  authorize, ADVISOR, ADMIN, LOGGED_USER
} = require('../../middlewares/auth');
const { list, update, create } = require('../../validations/responseJob.validation');

const router = express.Router();

router.param('responseJobId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/responseJobs List ResponseJobs
   * @apiDescription Get a list of ResponseJobs
   * @apiVersion 1.0.0
   * @apiName ListResponseJobs
   * @apiGroup ResponseJob
   * @apiPermission admin / user / advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  responseJob's per page
   * @apiParam  {String}  search      search param
   *
   * @apiSuccess {Object[]}   List of ResponseJobs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list)
  /**
   * @api {post} v1/responseJobs Create ResponseJobs
   * @apiDescription Create a new of ResponseJobs
   * @apiVersion 1.0.0
   * @apiName CreateResponseJobs
   * @apiGroup ResponseJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            label     ResponseJob's label
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   ResponseJob object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:responseJobId')
  /**
   * @api {get} v1/responseJobs/:id patch ResponseJobs
   * @apiDescription Get responseJobs information
   * @apiVersion 1.0.0
   * @apiName GetIResponseJob
   * @apiGroup ResponseJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            id     ResponseJob id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize([LOGGED_USER, ADVISOR]), controller.get)
  /**
   * @api {get} v1/responseJobs/:id patch ResponseJobs
   * @apiDescription Get responseJobs information
   * @apiVersion 1.0.0
   * @apiName GetIResponseJobs
   * @apiGroup ResponseJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            label     ResponseJob's label
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {get} v1/responseJobs/:id Delete responseJob
   * @apiDescription Delete responseJob information
   * @apiVersion 1.0.0
   * @apiName GetResponseJobs
   * @apiGroup ResponseJob
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id responseJob
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
