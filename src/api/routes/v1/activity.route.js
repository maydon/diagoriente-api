const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/activity.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  list,
  update,
  create
} = require('../../validations/activity.validation');

const router = express.Router();

router.param('activityId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/activities List Activities
   * @apiDescription Get a list of Activities
   * @apiVersion 1.0.0
   * @apiName ListActivities
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
   * @apiSuccess {Object[]}   List of Activities.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {get} v1/activities Create Activities
   * @apiDescription Create a new of Activities
   * @apiVersion 1.0.0
   * @apiName CreateActivities
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
  .route('/:activityId')
  /**
   * @api {get} v1/activities/:id patch Activities
   * @apiDescription Get activities information
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
  .get(authorize(ADMIN), controller.get)
  /**
   * @api {get} v1/activities/:id patch Activities
   * @apiDescription Get activities information
   * @apiVersion 1.0.0
   * @apiName GetIActivities
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
   * @api {get} v1/activities/:id Delete activity
   * @apiDescription Delete activity information
   * @apiVersion 1.0.0
   * @apiName GetActivities
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id activity
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
