const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const controller = require('../../controllers/theme.controller');
const { authorize, LOGGED_USER, ADMIN } = require('../../middlewares/auth');
const { create, update, list } = require('../../validations/theme.validation');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '../../../../uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const uploadIcon = multer({ storage });

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
   * @apiParam  {String}  type      search by type param ['professional', 'personal']
   *
   *
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
   * @apiParam  {String}  resources     add resources object {'color','backgroundColor'}
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
  .route('/all')
  /**
   * @api {get} v1/themes/all List Themes with activities object
   * @apiDescription Get a list of themes with activities object
   * @apiVersion 1.0.0
   * @apiName ListThemesAll
   * @apiGroup Theme
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  theme's per page
   * @apiParam  {String}      search  search param
   * @apiParam  {String}  type      search by type param ['professional', 'personal']
   *
   *
   *
   *
   *
   * @apiSuccess {Object[]}   List of themes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.listAll);

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
   *
   * @apiParam  {String}             title     Theme's title
   * @apiParam  {String{..120}}     description  Theme's description
   * @apiParam  {Boolean}            verified    Theme's verified
   * @apiParam  {String=profesional,personal}  [role]    Theme's role
   * @apiParam  {String}  resources     add resources object {'color','backgroundColor'}
   *
   * @apiSuccess {String}  id         Themes's id
   * @apiSuccess {String}  title       Themes's name
   * @apiSuccess {String}  description      Themes's email
   * @apiSuccess {String}  type       Themes's type
   * @apiSuccess {boolean} verified  Theme's role
   * @apiSuccess {boolean} verified  Theme's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {get} v1/themes/:id Patch Theme
   * @apiDescription Patch theme information
   * @apiVersion 1.0.0
   * @apiName UpdateTheme
   * @apiGroup Theme
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id         Themes's id
   * @apiSuccess {String}  title       Themes's name
   * @apiSuccess {String}  description      Themes's email
   * @apiSuccess {String}  type       Themes's type
   * @apiSuccess {boolean} verified  Theme's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
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

router
  .route('/media/:themeId')
  /**
   * @api {post} v1/themes/media/:themeId Theme upload resources
   * @apiDescription theme resources upload formdata
   * @apiVersion 1.0.0
   * @apiName ThemeMedia
   * @apiGroup Theme
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}   themeId     Theme id
   * @apiParam  {String}   icon     icon file
   * @apiParam  {String}   backgroundColor     backgroundColor code #343422
   * @apiParam  {String}   color     color code  #343422
   *
   *
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
  .post(authorize(), uploadIcon.single('icon'), controller.upload);

module.exports = router;
