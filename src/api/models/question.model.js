const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * Inetersts Schema
 * @private
 */

const questionScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      max: 120,
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
questionScheme.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'title'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

questionScheme.statics = {
  /**
   * Get theme
   *
   * @param {ObjectId} id - The objectId of theme.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let question;

      if (mongoose.Types.ObjectId.isValid(id)) {
        question = await this.findById(id).exec();
      }
      if (question) return question;

      throw new APIError({
        message: 'Question does not exist',
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
  list({ page = 1, perPage = 30 }) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Question
 */

module.exports = mongoose.model('Question', questionScheme);
