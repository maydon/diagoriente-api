const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/environment.controller');
const {
  authorize, ADVISOR, ADMIN, LOGGED_USER
} = require('../../middlewares/auth');
const { list, update, create } = require('../../validations/environment.validation');

const router = express.Router();

router.param('environmentId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/environments List Environments
   * @apiDescription Get a list of Environments
   * @apiVersion 1.0.0
   * @apiName ListEnvironments
   * @apiGroup Environment
   * @apiPermission admin / user / advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  environment's per page
   * @apiParam  {String}  search      search param
   *
   * @apiSuccess {Object[]}   List of Environments.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list)
  /**
   * @api {post} v1/environments Create Environments
   * @apiDescription Create a new of Environments
   * @apiVersion 1.0.0
   * @apiName CreateEnvironments
   * @apiGroup Environment
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     Environment's title
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Environment object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:environmentId')
  /**
   * @api {get} v1/environments/:id patch Environments
   * @apiDescription Get environments information
   * @apiVersion 1.0.0
   * @apiName GetIEnvironment
   * @apiGroup Environment
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            id     Environment id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize([LOGGED_USER, ADVISOR]), controller.get)
  /**
   * @api {get} v1/environments/:id patch Environments
   * @apiDescription Get environments information
   * @apiVersion 1.0.0
   * @apiName GetIEnvironments
   * @apiGroup Environment
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     Environment's title
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {get} v1/environments/:id Delete environment
   * @apiDescription Delete environment information
   * @apiVersion 1.0.0
   * @apiName GetEnvironments
   * @apiGroup Environment
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id environment
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
