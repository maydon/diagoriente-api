const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/question.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  update,
  list,
  create
} = require('../../validations/question.validation');

const router = express.Router();

router.param('questionId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/questions List Question rank
   * @apiDescription Get a list of renew password questions
   * @apiVersion 1.0.0
   * @apiName ListQuestions
   * @apiGroup Questions
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  questions's per page
   *
   * @apiSuccess {Object[]}   List of Questions.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(list), controller.list)
  /**
   * @api {post} v1/questions Create Questions
   * @apiDescription Create a new Questions
   * @apiVersion 1.0.0
   * @apiName CreateQuestions
   * @apiGroup Questions
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {String}      title question title (body)
   *
   * @apiSuccess {Object}  Questions      Questions object
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(validate(create), controller.create);

router
  .route('/:questionId')
  /**
   * @api {get} v1/questions/:questionId get Question byID
   * @apiDescription Get a questions byID
   * @apiVersion 1.0.0
   * @apiName GetQuestions
   * @apiGroup Questions
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   *
   * @apiSuccess {Object}    Questions Object.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {post} v1/questions   update Questions
   * @apiDescription Create a new Questions
   * @apiVersion 1.0.0
   * @apiName UpdateQuestions
   * @apiGroup Questions
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization  access token
   
   * @apiParam  {String}      id id Question (query)

   * @apiParam  {String}      title question title (body)
   *
   * @apiSuccess {Object}  Questions      Questions object
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(ADMIN), validate(create), controller.update)
  /**
   * @api {delete} v1/questions/:id Delete Question
   * @apiDescription Delete a Question
   * @apiVersion 1.0.0
   * @apiName DeleteQuestion
   * @apiGroup Questions
   * @apiPermission admin
   *
   *
   * @apiHeader {String} Authorization   access token
   *
   * @apiParam  {String}      id id Question (query)
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)   Forbidden  Only admins can delete the data
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
