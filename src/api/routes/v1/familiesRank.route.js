const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/familiesRank.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { list, update } = require('../../validations/familiesRank.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/familiesRank List family rank
   * @apiDescription Get a list of families rank
   * @apiVersion 1.0.0
   * @apiName ListFamiliesRank
   * @apiGroup Family
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
   *
   * @apiSuccess {Object[]}   List of families Rank.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {post} v1/families Create or update family rank
   * @apiDescription Create a new of Family or update
   * @apiVersion 1.0.0
   * @apiName CreateFamiliesRank
   * @apiGroup Family
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess {Object[]}  familiesRank      rank / pExpInt
   *
   * @apiSuccess {Object[]}  List families Rank.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(update), controller.update);

module.exports = router;
