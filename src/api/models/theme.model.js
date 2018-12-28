const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * User Schema
 * @private
 */

const types = ['profesional', 'personal'];

const themeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 20,
      trim: true,
      required: true
    },
    description: {
      type: String,
      maxlength: 120
    },
    type: {
      type: String,
      enum: types,
      required: true
    },
    verified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
themeSchema.method({
  transform() {
    const transformed = {};
    const fields = ['title', 'description', 'type', 'verified'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

themeSchema.statics = {
  types,
  /**
   * Get theme
   *
   * @param {ObjectId} id - The objectId of theme.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let theme;

      if (mongoose.Types.ObjectId.isValid(id)) {
        theme = await this.findById(id).exec();
      }
      if (theme) return theme;

      throw new APIError({
        message: 'Theme does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
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
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Theme', themeSchema);
