const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/skill.controller');
const { authorize, LOGGED_USER, ADMIN } = require('../../middlewares/auth');
const {
  create,
  createMulti,
  update,
  list
} = require('../../validations/skill.validation');

const router = express.Router();

/**
 * Load skill when API with skillId route parameter is hit
 */
router.param('skillId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/skills List Skills
   * @apiDescription Get a list of skills
   * @apiVersion 1.0.0
   * @apiName ListSkills
   * @apiGroup Skill
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  theme's per page
   * @apiParam  {String}      search  search param
   *
   * @apiSuccess {Object[]}   List of skills.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(list), controller.list)
  /**
   * @api {post} v1/skills Create Skill
   * @apiDescription Create a new Skill
   * @apiVersion 1.0.0
   * @apiName CreateSkill
   * @apiGroup Skill
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * 
   * @apiParam  {String}            parcourId     parcour's id
   * @apiParam  {String}            type     skill's type ['professional', 'personal']
   * @apiParam  {Boolean}           theme    theme's id
   * @apiParam  {Object[]}          activities    selected activities's ids
   * @apiParam  {Object[]}          competences    selected competences's ids {id : competenceId,value : [1,2,3,4]}

   *
   * @apiSuccess (Created 201) {String}  id         Skill's id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
    */
  .post(authorize(LOGGED_USER), validate(create), controller.create);

router
  .route('/multi')
  /**
   * @api {post} v1/skills Create multi Skill
   * @apiDescription Create a new Skills
   * @apiVersion 1.0.0
   * @apiName CreateMultiSkill
   * @apiGroup Skill
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * 
   * @apiParam  {String}            parcourId     parcour's id
   * @apiParam  {String}            type     skill's type ['professional', 'personal']
   * @apiParam  {Boolean}           theme    theme's id
   * @apiParam  {Object[]}          activities    selected activities's ids
   * @apiParam  {Object[]}          competences    selected competences's ids {id : competenceId,value : [1,2,3,4]}

   *
   * @apiSuccess (Created 201) {String}  id         Skill's id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
    */
  .post(authorize(LOGGED_USER), validate(createMulti), controller.createMulti);

router
  .route('/:skillId')
  /**
   * @api {post} v1/skills Update Skill
   * @apiDescription Update a existing Skill
   * @apiVersion 1.0.0
   * @apiName UpdateSkill
   * @apiGroup Skill
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * 
   * @apiParam  {String}            skillId     skill's id query param
   * 
   * @apiParam  {String}            type     skill's type ['professional', 'personal']
   * @apiParam  {Boolean}           theme    theme's id
   * @apiParam  {Object[]}          activities    selected activities's ids
   * @apiParam  {Object[]}          competences    selected competences's ids {id : competenceId,value : [1,2,3,4]}

   *
   * @apiSuccess (Created 201) {String}  id         Skill's id
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
    */
  .patch(authorize(LOGGED_USER), validate(update), controller.update);

module.exports = router;
