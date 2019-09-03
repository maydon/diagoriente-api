const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/commune.controller');

const { authorize, ADVISOR, LOGGED_USER } = require('../../middlewares/auth');
const { list } = require('../../validations/commune.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/commune List communes
   * @apiDescription Get a list of communes
   * @apiVersion 1.0.0
   * @apiName ListCommunes
   * @apiGroup Communes
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
   * @apiParam  {String}  search      search param
   * @apiParam  {String}  type      search by type param ['professional', 'personal']


   *
   * @apiSuccess {Object[]}   List of communes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADVISOR, LOGGED_USER), validate(list), controller.list);
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
   * @apiSuccess {Object[]}   List of themes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list);

module.exports = router;
