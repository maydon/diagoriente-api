const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/job.controller');
const {
  authorize,
  ADVISOR,
  LOGGED_USER,
  ADMIN
} = require('../../middlewares/auth');
const {
  create,
  update,
  list,
  myJob
} = require('../../validations/job.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('jobId', controller.load);

router
  .route('/myJobs')
  /**
   * @api {get} v1/jobs/myJobs List MyJobs
   * @apiDescription Get a list of recommanded jobs
   * @apiVersion 1.0.0
   * @apiName MyJobs
   * @apiGroup Job
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  job's per page
   * @apiParam  {String}      search  search param
   * @apiParam  {String}        id     Parcour's id
   *
   * @apiSuccess {Object[]}   List of jobs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADVISOR, LOGGED_USER]), validate(myJob), controller.myJob);

router
  .route('/')
  /**
   * @api {get} v1/jobs List Jobs
   * @apiDescription Get a list of jobs
   * @apiVersion 1.0.0
   * @apiName ListJobs
   * @apiGroup Job
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization  access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  job's per page
   * @apiParam  {String}      search  search param
   *
   * @apiSuccess {Object[]}   List of jobs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(list), controller.list)
  /**
   * @api {post} v1/jobs Create Job
   * @apiDescription Create a new job
   * @apiVersion 1.0.0
   * @apiName CreateJob
   * @apiGroup Job
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             title     Job's title
   * @apiParam  {String{..120}}     description  Job's description
   * @apiParam  {Object[]}  interests      Job's interests [{id,weight}]
   * @apiParam  {Object[]}  competences      Job's competences [{id,weight}]
   * @apiParam  {Object[]}  formations      Job's formations
   *
   *
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(create), controller.create);

router
  .route('/:jobId')
  /**
   * @api {get} v1/jobs/:id Get Job by Id
   * @apiDescription Get job information
   * @apiVersion 1.0.0
   * @apiName GetJob
   * @apiGroup Job
   * @apiPermission admin / user
   *
   * @apiHeader {String} Authorization    access token
   *
   * @apiSuccess {String}  id         Job's id
   * @apiSuccess {String}  title       Job's name
   * @apiSuccess {String}  description      Job's email
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Not Found 404)    NotFound     Job does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {patch} v1/jobs/:id update Job
   * @apiDescription Get job information
   * @apiVersion 1.0.0
   * @apiName UpdateJob
   * @apiGroup Job
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             title     Job's title
   * @apiParam  {String{..120}}     description  Job's description
   * @apiParam  {Object[]}  interests      Job's interests [{id,weight}]
   * @apiParam  {Object[]}  competences      Job's competences [{id,weight}]
   * @apiParam  {Object[]}  formations      Job's formations
   *
   * @apiError (Forbidden 403)    Forbidden    Only admin can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(ADMIN), validate(update), controller.update)
  /**
   * @api {delete} v1/jobs/:id Delete Job
   * @apiDescription Delete a job
   * @apiVersion 1.0.0
   * @apiName DeleteJob
   * @apiGroup Job
   * @apiPermission admin
   *
   *
   * @apiHeader {String} Authorization   access token
   *
   * @apiParam  {String}      id id job
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Forbidden 403)   Forbidden  Only admins can delete the data
   */
  .delete(authorize(ADMIN), controller.remove);

module.exports = router;
