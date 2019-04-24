const express = require('express');
const controller = require('../../controllers/mailer.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/mailer test mailer
   * @apiDescription Testing mailer middlewares
   * @apiVersion 1.0.0
   * @apiName MailerTesting
   * @apiGroup Mailer
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   *
   * @apiSuccess {Object[]}   mailer response object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), controller.mailer);

module.exports = router;
