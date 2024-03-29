const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const {
  authorize,
  ADMIN,
  ADVISOR,
  LOGGED_USER
} = require('../../middlewares/auth');
const {
  list,
  update,
  addUser,
  addAdvisor,
  aprouvedUser,
  updateAdvisor,
  renewPassword,
  updatePassword,
  renewPasswordBySecretQuestion,
  updatePasswordBySecretQuestion
} = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/users List users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  theme's per page
   * @apiParam  {String}      search  search param
   *
   * @apiSuccess {Object[]}   List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, ADVISOR]), validate(list), controller.list);

router
  .route('/advisors')
  /**
   * @api {post} v1/users/advisors add  advisor
   * @apiDescription add new advisor
   * @apiVersion 1.0.0
   * @apiName AddAdvisor
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         email    advisor email
   * @apiParam  {String}         password    advisor password
   * @apiParam  {String}       firstName    advisor firstName
   * @apiParam  {String}       lastName    advisor firstName
   * @apiParam  {String}       institution    advisor institution
   *
   * @apiSuccess {Object[]}   advisor object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can create the data
   */
  .post(authorize(ADMIN), validate(addAdvisor), controller.addAdvisor);

router
  .route('/addUser')
  /**
   * @api {post} v1/users/addUser add user
   * @apiDescription add new user
   * @apiVersion 1.0.0
   * @apiName AddUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}        email    user email
   * @apiParam  {String}       password    user password
   * @apiParam  {String}       firstName    user firstName
   * @apiParam  {String}       lastName    user firstName
   * @apiParam  {String}       institution    user institution
   * @apiParam  {Object}       question    { _id (question) , response }
   *
   * @apiSuccess {Object[]}   user object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can create the data
   */
  .post(validate(addUser), controller.addUser);

router
  .route('/renewPassword')
  /**
   * @api {post} v1/users/renewPassword renew password
   * @apiDescription send link renew password
   * @apiVersion 1.0.0
   * @apiName renewPassword
   * @apiGroup User
   * @apiPermission user/advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         email    advisor email
   *
   * @apiSuccess {Object[]}   user object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can create the data
   */
  .post(validate(renewPassword), controller.renewPassword);

router
  .route('/updatePassword')
  /**
   * @api {post} v1/users/updatePassword renew password
   * @apiDescription send link renew password
   * @apiVersion 1.0.0
   * @apiName updatePassword
   * @apiGroup User
   * @apiPermission user/advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         password    user password
   *
   * @apiSuccess {Object[]}   user object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can create the data
   */
  .post(validate(updatePassword), controller.updatePassword);

router
  .route('/renewPasswordBySecretQuestion')
  /**
   * @api {post} v1/users/renewPasswordBySecretQuestion renew password
   * @apiDescription send link renew password
   * @apiVersion 1.0.0
   * @apiName renewPasswordBySecretQuestion
   * @apiGroup User
   * @apiPermission user/advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         email    user-email
   * @apiParam  {Object}         question   user secret question
   *
   * @apiSuccess {Object[]}   user object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can create the data
   */
  .post(
    validate(renewPasswordBySecretQuestion),
    controller.renewPasswordBySecretQuestion
  );

router
  .route('/updatePasswordBySecretQuestion')
  /**
   * @api {post} v1/users/updatePasswordBySecretQuestion renew password
   * @apiDescription send link renew password
   * @apiVersion 1.0.0
   * @apiName updatePasswordBySecretQuestion
   * @apiGroup User
   * @apiPermission user/advisor
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         email    user email
   * @apiParam  {String}         password    user password
   * @apiParam  {String}         token    renew password token
   * @apiParam  {Object}         question   { _id (question) , response }
   *
   * @apiSuccess {Object[]}   user object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can create the data
   */
  .post(
    validate(updatePasswordBySecretQuestion),
    controller.updatePasswordBySecretQuestion
  );

router
  .route('/updateMe/:userId')
  /**
   * @api {patch} v1/users/:userId patch  user
   * @apiDescription patch  user
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         OldPassword    user OldPassword
   * @apiParam  {String}         password    user password
   * @apiParam  {String}         pseudo    user platform
   * @apiParam  {String}       firstName    user firstName
   * @apiParam  {String}       lastName    user lastName
   *
   * @apiSuccess {Object[]}   user object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can update the data
   */
  .patch(authorize(LOGGED_USER), validate(update), controller.update);

router
  .route('/advisors/:userId')
  /**
   * @api {patch} v1/users/advisors patch  advisor
   * @apiDescription update  advisor
   * @apiVersion 1.0.0
   * @apiName UpdateAdvisor
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}         email    advisor email
   * @apiParam  {String}         password    advisor password
   * @apiParam  {String}       firstName    advisor firstName
   * @apiParam  {String}       lastName    advisor firstName
   * @apiParam  {String}       institution    advisor institution
   *
   * @apiSuccess {Object[]}   advisor object.
   *
   * @apiError (Forbidden 403)     Forbidden     Only admins can update the data
   */
  .patch(
    authorize([ADMIN, ADVISOR]),
    validate(updateAdvisor),
    controller.updateAdvisor
  );

router
  .route('/:userId')
  /**
   * @api {get} v1/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization    access token
   *
   * @apiSuccess {String}  id         User id
   *
   * @apiSuccess {String}  id      User id
   * @apiSuccess {String}  uniqId      User device id
   * @apiSuccess {String}  role      User role
   * @apiSuccess {String}  createdAt      User date creation
   *
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize([ADMIN, ADVISOR]), controller.get)
  /**
   * @api {delete} v1/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName deleteUser
   * @apiGroup User
   * @apiPermission admin
   *
   *
   * @apiHeader {String} Authorization   access token
   *
   * @apiParam  {String}      id id user
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)   Forbidden  Only admins can delete the data
   */
  .delete(authorize(ADMIN), controller.remove)
  /**
   * @api {put} v1/users/:id Approuve user
   * @apiDescription Add profil object to user
   * @apiVersion 1.0.0
   * @apiName ApprouveUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization    access token
   *
   * @apiParam  {String}         id    user
   * @apiParam  {String}         email    user email
   * @apiParam  {String}         password    user password
   * @apiParam  {String}         firstName    user firstName
   * @apiParam  {String}         lastName    user lastName
   *
   * @apiSuccess  {Object[]}         user    updated user
   *
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .put(authorize(LOGGED_USER), validate(aprouvedUser), controller.aprouvedUser);

router
  .route('/me/profil')
  /**
   * @api {get} v1/users/me/profil Get me profil
   * @apiDescription Get my object user information
   * @apiVersion 1.0.0
   * @apiName GetMe
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization    access token
   *
   *
   * @apiSuccess {String}  id      User id
   * @apiSuccess {String}  uniqId      User device id
   * @apiSuccess {String}  role      User role
   * @apiSuccess {String}  createdAt      User date creation
   *
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER), controller.loggedIn);

module.exports = router;
