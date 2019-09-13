const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/parcour.controller');
const {
  authorize, ADVISOR, LOGGED_USER, ADMIN
} = require('../../middlewares/auth');
const {
  list,
  get,
  getByUser,
  create,
  update,
  addFamilies,
  deleteParcour,
  updateCompetences
} = require('../../validations/parcour.validation');

const router = express.Router();

router.param('parcourId', controller.load);

router
  .route('/')
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
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  parcours per page
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
   * @api {get} v1/parcours/families/:parcourId Add families
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
   * @apiParam  {String}            type     Parcours personal or professional
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
  .route('/public/:userId')
  /**
   * @api {get} v1/parcours/public/:userId Get Parcours
   * @apiDescription Get a Parcours
   * @apiVersion 1.0.0
   * @apiName GetPublicParcours
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         id     user object id
   *
   *
   * @apiSuccess {Object[]} parcour  parcour full object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(getByUser), controller.getParcourByUserId);
router
  .route('/:parcourId')
  /**
   * @api {get} v1/parcours Get Parcours
   * @apiDescription Get a Parcours
   * @apiVersion 1.0.0
   * @apiName GetParcours
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         id     parcour object id
   * @apiParam  {String}            type     Parcours personal or professional
   *
   *
   * @apiSuccess {Object[]} parcour  parcour full object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(get), controller.get)

  /**
   * @api {post} v1/parcours/:parcourId' Update Parcours
   * @apiDescription update parcour
   * @apiVersion 1.0.0
   * @apiName UpdateParcours
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}            userId     Parcours  userId
   * @apiParam  {Boolean}          completed    parcour completed or not
   * @apiParam  {Object[]}          skills    skill's ids associated to parcour
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Parcour object.
   *
   * @apiSuccess {Object[]} parcour  parcour full object.
   *
   * @apiError (Bad Request 400)  BadRequest  wrong value for wrong type of skill
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([LOGGED_USER, ADVISOR]), validate(update), controller.update)
  /**
   * @api {put} v1/parcours/:parcourId' Upadate Parcours Competences
   * @apiDescription update parcour competences
   * @apiVersion 1.0.0
   * @apiName UpdateParcoursCompetences
   * @apiGroup Parcour
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Object[]}          competences    array with objects having _id and value
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   Parcour object.
   *
   * @apiSuccess {Object[]} parcour  parcour full object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .put(authorize([LOGGED_USER, ADVISOR]), validate(updateCompetences), controller.updateCompetences)
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
