const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/competence.controller');
const {
  authorize, ADVISOR, ADMIN, LOGGED_USER
} = require('../../middlewares/auth');
const { list, create, update } = require('../../validations/competence.validation');

const router = express.Router();
router.param('competenceId', controller.load);

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
  .get(authorize([LOGGED_USER, ADVISOR, ADMIN]), validate(list), controller.list);

router
  .route('/:competenceId')
  /**
   * @api {get} v1/activities/:id patch Activities
   * @apiDescription Get activities information
   * @apiVersion 1.0.0
   * @apiName GetIActivity
   * @apiGroup Activity
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            id     Activity id
   * @apiParam  {Object[]}          interests    interests's ids
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize(ADMIN), controller.get)
  /**
   * @api {post} v1/competences create competences cart
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
router
  .route('/:competenceId')
  /**
   * @api {patch} v1/competences/:id patch competences cart
   * @apiDescription Update competence
   * @apiVersion 1.0.0
   * @apiName UpdateCompetence
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
  .patch(authorize(ADMIN), validate(update), controller.update);

module.exports = router;
