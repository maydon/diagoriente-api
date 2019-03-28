const express = require('express');
const validate = require('express-validation');
const multer = require('multer');
const controller = require('../../controllers/family.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  list,
  update,
  create,
  removeResources
} = require('../../validations/family.validation');

const router = express.Router();

router.param('familyId', controller.load);

const uploadFamily = multer({ encoding: 'binary' });

router
  .route('/')
  /**
   * @api {get} v1/families List family
   * @apiDescription Get a list of families
   * @apiVersion 1.0.0
   * @apiName ListFamilies
   * @apiGroup Family
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
   * @apiParam  {String}      search search param
   *
   * @apiSuccess {Object[]}   List of families.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {post} v1/families Create family
   * @apiDescription Create a new of Family
   * @apiVersion 1.0.0
   * @apiName CreateFamilies
   * @apiGroup Family
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess {String}  nom       Interest's name
   * @apiSuccess {Object[]}  interests      Interest's liste
   * @apiSuccess {String}  rank      Interest's email
   *
   * @apiSuccess {Object[]}   List of intersts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/addUploads/:familyId')
  /**
   * @api {post} v1/families/addUploads/:familyId Upload family resources
   * @apiDescription Upload Family resources (add)
   * @apiVersion 1.0.0
   * @apiName UploadFamilyResources
   * @apiGroup Family
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess {String}  id       families's id
   * @apiSuccess {Object[]}  photos      family resources
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize(ADMIN),
    uploadFamily.array('photos', 3),
    controller.addResources
  );

router
  .route('/removeUploads/:familyId')
  /**
   * @api {post} v1/families/removeUploads/:familyId Upload family resources
   * @apiDescription remove Family resources (remove)
   * @apiVersion 1.0.0
   * @apiName UploadFamilyResources
   * @apiGroup Family
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess {String}  id       families's id
   * @apiSuccess {String}  resource      family resources id to delete
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize(ADMIN),
    validate(removeResources),
    controller.removeResources
  );

router
  .route('/:familyId')
  /**
   * @api {get} v1/families/:id get family
   * @apiDescription Get  Family by id
   * @apiVersion 1.0.0
   * @apiName GetFamily
   * @apiGroup Family
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {string}       id    id Family
   *
   * @apiSuccess {Object[]}   List of families.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.get)
  /**
   * @api {patch} v1/families/:id patch family
   * @apiDescription Get family information
   * @apiVersion 1.0.0
   * @apiName GetFamily
   * @apiGroup Family
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  nom       Family's name
   * @apiSuccess {Object[]}  interests      Interest's liste
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {delete} v1/families/:id Delete family
   * @apiDescription Delete families information
   * @apiVersion 1.0.0
   * @apiName DeleteFamily
   * @apiGroup Family
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}      id id Family

   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
