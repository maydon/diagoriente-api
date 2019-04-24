const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/competence.controller');
const {
  authorize,
  ADVISOR,
  ADMIN,
  LOGGED_USER
} = require('../../middlewares/auth');
const { list, create } = require('../../validations/competence.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/competences List competences cart
   * @apiDescription Get a list of competences
   * @apiVersion 1.0.0
   * @apiName ListCompetences
   * @apiGroup Competence
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   *
   * @apiSuccess {Object[]}   List of competences.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([LOGGED_USER, ADVISOR]), validate(list), controller.list)
  /**
   * @api {get} v1/competences List competences cart
   * @apiDescription Create competence
   * @apiVersion 1.0.0
   * @apiName CreateCompetence
   * @apiGroup Competence
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   *
   * @apiSuccess {String}   id of competence.
   * @apiSuccess {String}   title of competence.
   * @apiSuccess {String}   rank of competence.
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

module.exports = router;
