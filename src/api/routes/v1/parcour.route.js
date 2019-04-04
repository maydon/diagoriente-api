const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/parcour.controller');
const {
  authorize,
  ADVISOR,
  LOGGED_USER,
  ADMIN
} = require('../../middlewares/auth');
const {
  list,
  get,
  create,
  addFamilies,
  deleteParcour
} = require('../../validations/parcour.validation');

const router = express.Router();

router.param('parcourId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/parcours List Parcours
   * @apiDescription Get a list of Parcours
   * @apiVersion 1.0.0
   * @apiName ListActivities
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
 
   *
   * @apiSuccess {Object[]}   List of parcours.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list)
  /**
   * @api {get} v1/parcours Create parcours
   * @apiDescription Create a new of parcours
   * @apiVersion 1.0.0
   * @apiName CreateParcours
   * @apiGroup Parcour
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            userId     Parcours  userId
   * @apiParam  {Boolean}          completed    parcour completed or not
   * @apiParam  {Object[]}          skills    skill's ids associated to parcour
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Parcour object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(create), controller.create);

router
  .route('/families/:parcourId')
  /**
   * @api {get} v1/parcours Add families
   * @apiDescription Add families to parcours
   * @apiVersion 1.0.0
   * @apiName AddFamiliesParcours
   * @apiGroup Parcour
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            parcourId     Parcours  id
   * @apiParam  {Object[]}          families    add families ids
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Parcour object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(addFamilies), controller.addFamilies);

router
  .route('/:parcourId')
  /**
   * @api {get} v1/parcours List Parcours
   * @apiDescription Get a list of Parcours
   * @apiVersion 1.0.0
   * @apiName ListParcours
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         id     parcour object id
   *
   *
   * @apiSuccess {Object[]} parcour  parcour full object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(get), controller.get)
  /**
   * @api {get} v1/parcours Delete Parcours
   * @apiDescription Delete Parcour
   * @apiVersion 1.0.0
   * @apiName DeleteParcour
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiSuccess {Object[]}   List of parcours.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .delete(authorize(ADMIN), validate(deleteParcour), controller.remove);

module.exports = router;
