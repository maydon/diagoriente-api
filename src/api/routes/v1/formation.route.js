const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/formation.controller');
const { authorize, LOGGED_USER, ADMIN } = require('../../middlewares/auth');
const { create, list } = require('../../validations/formation.validation');

const router = express.Router();

/**
 * Load formation when API with formationId route parameter is hit
 */
router.param('formationId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/formations List Formations
   * @apiDescription Get a list of formations
   * @apiVersion 1.0.0
   * @apiName ListFormation
   * @apiGroup Formation
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  theme's per page
   * @apiParam  {String}      search  search param
   *
   * @apiSuccess {Object[]}   List of formations.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {post} v1/formations Create Formation
   * @apiDescription Create a new formation
   * @apiVersion 1.0.0
   * @apiName CreateFormation
   * @apiGroup Formation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             title     Formation's title
   * @apiParam  {String{..120}}     description  Formation's description
   * @apiParam  {String{..120}}     establishment  Formation's establishment
   * @apiParam  {Object{adress, postalCode, country}}     adress  Formation's adress
   * @apiParam  {Object{email, webAdress, phone}}       Formation's contact
   *
   * @apiSuccess (Created 201) {String}  id         Formation's object data
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:formationId')
  /**
   * @api {get} v1/formations/:id Get Formation
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName Getformations
   * @apiGroup Formation
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization    access token
   *
   * @apiSuccess (Created 201) {String}  Formation    Formation's object data
   *
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {get} v1/formations/:id Get Formation
   * @apiDescription Get Formation information
   * @apiVersion 1.0.0
   * @apiName GetFormation
   * @apiGroup Formation
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Formation's access token
   *
   * @apiSuccess (Created 201) {String}  Formation    Formation's object data
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), controller.update)
  /**
   * @api {patch} v1/formations/:id Delete Formation
   * @apiDescription Delete a formation
   * @apiVersion 1.0.0
   * @apiName DeleteFormation
   * @apiGroup Formation
   * @apiPermission admin
   *
   *
   * @apiHeader {String} Authorization   access token
   *
   * @apiParam  {String}      id id Formation
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)   Forbidden  Only admins can delete the data
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
