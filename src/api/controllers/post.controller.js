const httpStatus = require('http-status');
const Post = require('../models/post.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const post = await Post.get(id);
    req.locals = { post };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get post
 * @public
 */
exports.get = (req, res) => res.json(req.locals.post.transform());

/**
 * Create new post
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.status(httpStatus.CREATED);
    res.json(savedPost.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Get posts list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const posts = await Post.list(req.query);
    const transformedPosts = posts.map(post => post.transform());
    res.json(transformedPosts);
  } catch (error) {
    next(error);
  }
};
