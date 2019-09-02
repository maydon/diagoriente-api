const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/commune.controller');

const { authorize, ADVISOR, LOGGED_USER } = require('../../middlewares/auth');
const { list } = require('../../validations/commune.validation');

const router = express.Router();

router.param('communeId', controller.load);
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
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list);
module.exports = router;
