const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/context.controller');
const {
  authorize,
  ADVISOR,
  ADMIN,
  LOGGED_USER
} = require('../../middlewares/auth');
const {
  list,
  update,
  create
} = require('../../validations/context.validation');

const router = express.Router();

router.param('contextId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/contexts List Contexts
   * @apiDescription Get a list of Contexts
   * @apiVersion 1.0.0
   * @apiName ListContexts
   * @apiGroup Context
   * @apiPermission admin / user / advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  context's per page
   * @apiParam  {String}  search      search param
   *
   * @apiSuccess {Object[]}   List of Contexts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list)
  /**
   * @api {post} v1/contexts Create Contexts
   * @apiDescription Create a new of Contexts
   * @apiVersion 1.0.0
   * @apiName CreateContexts
   * @apiGroup Context
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     Context's title
   * @apiParam  {String}            description     Context's description
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Context object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:contextId')
  /**
   * @api {get} v1/contexts/:id patch Contexts
   * @apiDescription Get contexts information
   * @apiVersion 1.0.0
   * @apiName GetIContext
   * @apiGroup Context
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            id     Context id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize([LOGGED_USER, ADVISOR]), controller.get)
  /**
   * @api {get} v1/contexts/:id patch Contexts
   * @apiDescription Get contexts information
   * @apiVersion 1.0.0
   * @apiName GetIContexts
   * @apiGroup Context
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     Context's title
   * @apiParam  {String}            type     Context's type ['professional', 'personal']
   * @apiParam  {Boolean}           verified    Context's verified
   * @apiParam  {Object[]}          interests    interests's ids
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update);

module.exports = router;
