const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/favorite.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const {
  list,
  update,
  create
} = require('../../validations/favorite.validation');

const router = express.Router();

router.param('favoriteId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/favorites List Favorites
   * @apiDescription Get a list of favorites
   * @apiVersion 1.0.0
   * @apiName ListFavorites
   * @apiGroup Favorite
   * @apiPermission  user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  interest's per page
   *
   * @apiSuccess {Object[]}   List of favorites.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {post} v1/favorites Create favorite
   * @apiDescription Create a new favorite fob
   * @apiVersion 1.0.0
   * @apiName CreateFavorite
   * @apiGroup Favorite
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiSuccess {String}  user       user id
   * @apiSuccess {string}  parcour      parcour id
   * @apiSuccess {string}  job      job id
   * @apiSuccess {Boolean}  interested      interested true or false
   *
   * @apiSuccess {Object[]}    favorite object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(create), controller.create);

router
  .route('/:favoriteId')
  /**
   * @api {get} v1/favorites/:id get favorite
   * @apiDescription Get  Favorite by id
   * @apiVersion 1.0.0
   * @apiName GetFavorite
   * @apiGroup Favorite
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {string}       id    id Favorite
   *
   * @apiSuccess {Object[]}  favorite object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.get)
  /**
   * @api {patch} v1/favorites/:id patch favorite
   * @apiDescription Update favorite information
   * @apiVersion 1.0.0
   * @apiName PatchFavorite
   * @apiGroup Favorite
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {string}       id    id Favorite
   *
   * @apiSuccess {String}  user       user id
   * @apiSuccess {string}  parcour      parcour id
   * @apiSuccess {string}  job      job id
   * @apiSuccess {Boolean}  interested      interested true or false
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(LOGGED_USER), validate(update), controller.update)
  /**
   * @api {delete} v1/families/:id Delete family
   * @apiDescription Delete families information
   * @apiVersion 1.0.0
   * @apiName DeleteFavorite
   * @apiGroup Favorite
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {string}       id    id Favorite

   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
