const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/context.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
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
   * @apiGroup Activity
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
   * @apiParam  {String}  search      search param
   * @apiParam  {String}  type      search by type param ['professional', 'personal']


   *
   * @apiSuccess {Object[]}   List of Contexts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(list), controller.list)
  /**
   * @api {get} v1/contexts Create Contexts
   * @apiDescription Create a new of Contexts
   * @apiVersion 1.0.0
   * @apiName CreateContexts
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     Activity's title
   * @apiParam  {String}            type     Activity's type ['professional', 'personal']
   * @apiParam  {Boolean}           verified    Activity's verified
   * @apiParam  {Object[]}          interests    interests's ids
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Activity object.
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
   * @apiName GetIActivity
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            id     Activity id
   * @apiParam  {Object[]}          interests    interests's ids
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {get} v1/contexts/:id patch Contexts
   * @apiDescription Get contexts information
   * @apiVersion 1.0.0
   * @apiName GetIContexts
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     Activity's title
   * @apiParam  {String}            type     Activity's type ['professional', 'personal']
   * @apiParam  {Boolean}           verified    Activity's verified
   * @apiParam  {Object[]}          interests    interests's ids
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {get} v1/contexts/:id Delete context
   * @apiDescription Delete context information
   * @apiVersion 1.0.0
   * @apiName GetContexts
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id context
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
