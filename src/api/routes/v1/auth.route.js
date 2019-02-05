const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const {
  login,
  loginAdmin,
  loginAdvisor,
  refresh
} = require('../../validations/auth.validation');

const router = express.Router();

/**
 * @api {post} v1/auth/user Login user
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login user
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         uniqId     User's uniqId phone platform
 * @apiParam  {String}         platform     User's platform phone ['android', 'ios']
 *
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 *
 * @apiSuccess  {String}  user.id             User's id
 * @apiSuccess  {String}  user.uniqId         User's uniqId
 * @apiSuccess  {String}  user.role           User's role
 * @apiSuccess  {Date}    user.createdAt      Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/user').post(validate(login), controller.login);
/**
 * @api {post} v1/auth/admin Login admin
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login admin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String{..128}}  password  User's password
 *
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 *
 * @apiSuccess  {String}  user.id             Admin's id
 * @apiSuccess  {String}  user.email          Admin's email
 * @apiSuccess  {String}  user.role           Admin's role
 * @apiSuccess  {Date}    user.createdAt      Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/admin').post(validate(loginAdmin), controller.loginAdmin);

/**
 * @api {post} v1/auth/zdvisor Login advisor
 * @apiDescription Get an accessToken for advisor
 * @apiVersion 1.0.0
 * @apiName Login advisor
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     advisor email
 * @apiParam  {String}         password     advisor password
 *
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 *
 * @apiSuccess  {object[]}  advisor             advisor object
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/advisor').post(validate(loginAdvisor), controller.loginAdvisor);

/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  userId         User's document id
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/refresh-token').post(validate(refresh), controller.refresh);

module.exports = router;
