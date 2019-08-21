const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const types = ['professional', 'personal'];
/**
 * QuestionJobs Schema
 * @private
 */

const questionJobSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      maxlength: 250,
      trim: true,
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
questionJobSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'label'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

questionJobSchema.statics = {
  types,
  /**
   * Get questionJob
   *
   * @param {ObjectId} id - The objectId of questionJob.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let questionJob;

      if (mongoose.Types.ObjectId.isValid(id)) {
        questionJob = await this.findById(id);
      }
      if (questionJob) return questionJob;
      throw new APIError({
        message: 'QuestionJob does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List questionJobs in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of questionJobs to be skipped.
   * @param {number} limit - Limit number of questionJobs to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');

    return this.find({ label: reg })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('QuestionJob', questionJobSchema);
