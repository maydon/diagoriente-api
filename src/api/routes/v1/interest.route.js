const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/interest.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  list,
  update,
  create
} = require('../../validations/interest.validation');

const router = express.Router();

router.param('interestId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/interests List Interests
   * @apiDescription Get a list of Interests
   * @apiVersion 1.0.0
   * @apiName ListIntersts
   * @apiGroup Interest
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
   * @apiParam  {String}      search search param
   *
   * @apiSuccess {Object[]}   List of intersts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {get} v1/interests Create Interest
   * @apiDescription Create a new of Interest
   * @apiVersion 1.0.0
   * @apiName CreateIntersts
   * @apiGroup Interest
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess {String}  nom       Interest's name
   * @apiSuccess {String}  rank      Interest's email
   *
   * @apiSuccess {Object[]}   List of intersts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:interestId')
  /**
   * @api {get} v1/interests/:id patch interest
   * @apiDescription Get interest information
   * @apiVersion 1.0.0
   * @apiName GetInterest
   * @apiGroup Interest
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  nom       Interest's name
   * @apiSuccess {String}  rank      Interest's email
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {get} v1/interests/:id Delete interest
   * @apiDescription Delete interests information
   * @apiVersion 1.0.0
   * @apiName DeleteInterest
   * @apiGroup Interest
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id interest

   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
