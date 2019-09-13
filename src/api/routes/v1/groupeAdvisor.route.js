const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/groupeAdvisor.contoller');
const { authorize, ADVISOR, ADMIN } = require('../../middlewares/auth');
const {
  list,
  get,
  listByAdvisor,
  update,
  create
} = require('../../validations/groupeAdvisor.validation');

const router = express.Router();

router.param('groupeId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/groupe List groupes
   * @apiDescription Get a list of groupes
   * @apiVersion 1.0.0
   * @apiName Listgroupes
   * @apiGroup Groupe
   * @apiPermission admin / advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  groupe's per page
   * @apiParam  {String}  search      search param
   *
   * @apiSuccess {Object[]}   List of groupes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, ADVISOR]), validate(list), controller.list)
  /**
   * @api {post} v1/groupe Create groupe
   * @apiDescription Create a new of groupe
   * @apiVersion 1.0.0
   * @apiName CreateGroupe
   * @apiGroup Groupe
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     groupe title
   * @apiParam  {String}            advisorId     advisorId
   * @apiParam  {String}            code     groupe code
   * @apiParam  {String}            users     users of groupe
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiSuccess {Object[]}   groupe object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN, ADVISOR), validate(create), controller.create);
router
  .route('/advisor/:advisorId')
  /**
   * @api {get} v1/groupe/advisor/:id list groupes of advisor
   * @apiDescription Get a list of groupes  of advisor
   * @apiVersion 1.0.0
   * @apiName ListGroupesOfAdvisor
   * @apiGroup Groupe
   * @apiPermission admin / advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  groupe's per page
   * @apiParam  {String}  search      search param
   *
   * @apiSuccess {Object[]}   List of groupes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, ADVISOR]), validate(listByAdvisor), controller.list);

router
  .route('/groupeId/:groupeId')
  /**
   * @api {get} v1/groupe/groupeId/:id get one groupe by id
   * @apiDescription Get groupe one information
   * @apiVersion 1.0.0
   * @apiName Get one Groupe
   * @apiGroup Groupe
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   advisor's access token
   *
   * @apiParam  {String}            id     groupe id
   * @apiParam  {String}            title     groupe title
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .get(authorize([ADMIN, ADVISOR]), validate(get), controller.get)
  /**
   * @api {get} v1/groupe/:id patch groupes by id
   * @apiDescription update groupe information
   * @apiVersion 1.0.0
   * @apiName UpdateGroupe
   * @apiGroup Groupe
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}            title     groupe title
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     Theme does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update);

module.exports = router;
