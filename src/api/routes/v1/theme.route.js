const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/theme.controller');
const { authorize, LOGGED_USER, ADMIN } = require('../../middlewares/auth');
const { create, list } = require('../../validations/theme.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('themeId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/themes List Themes
   * @apiDescription Get a list of themes
   * @apiVersion 1.0.0
   * @apiName ListThemes
   * @apiGroup Theme
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  theme's per page
   * @apiParam  {String}      search  search param
   *
   * @apiSuccess {Object[]}   List of themes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {post} v1/themes Create Theme
   * @apiDescription Create a new theme
   * @apiVersion 1.0.0
   * @apiName CreateTheme
   * @apiGroup Theme
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             title     Theme's title
   * @apiParam  {String{..120}}     description  Theme's description
   * @apiParam  {Boolean}            verified    Theme's verified
   * @apiParam  {String=profesional,personal}  [role]    Theme's role
   *
   * @apiSuccess (Created 201) {String}  id         Theme's id
   * @apiSuccess (Created 201) {String}  title       Theme's title
   * @apiSuccess (Created 201) {String}  description      Theme's description
   * @apiSuccess (Created 201) {String}  role       Theme's role
   * @apiSuccess (Created 201) {boolean} verified       Theme's role

   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:themeId')
  /**
   * @api {get} v1/themes/:id Get Theme
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetTheme
   * @apiGroup Theme
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization    access token
   *
   * @apiSuccess {String}  id         Themes's id
   * @apiSuccess {String}  title       Themes's name
   * @apiSuccess {String}  description      Themes's email
   * @apiSuccess {String}  role       Themes's role
   * @apiSuccess {boolean} verified  Theme's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {get} v1/themes/:id Get Theme
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetTheme
   * @apiGroup Theme
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id         Themes's id
   * @apiSuccess {String}  title       Themes's name
   * @apiSuccess {String}  description      Themes's email
   * @apiSuccess {String}  role       Themes's role
   * @apiSuccess {boolean} verified  Theme's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), controller.update)
  /**
   * @api {patch} v1/themes/:id Delete Theme
   * @apiDescription Delete a theme
   * @apiVersion 1.0.0
   * @apiName Deletetheme
   * @apiGroup Theme
   * @apiPermission admin
   *
   *
   * @apiHeader {String} Authorization   access token
   *
   * @apiParam  {String}      id id theme
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)   Forbidden  Only admins can delete the data
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
