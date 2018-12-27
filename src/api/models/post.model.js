const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Schema
 * @private
 */

const postSchema = new mongoose.Schema(
  {
    id_user: {
      type: String,
      required: true,
    },
    id_parent: {
      type: String,
      required: true,
    },
    id_caregories: {
      type: String,
      maxlength: 50,
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 128,
    },
    media: {
      type: String,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
postSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id_user',
      'id_parent',
      'id_caregories',
      'name',
      'description',
      'media',
      'isVisible',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

postSchema.statics = {
  /**
   * List posts in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, name }) {
    const options = omitBy({ name }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Post', postSchema);
