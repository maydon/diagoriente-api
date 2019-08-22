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
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
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
    const fields = ['_id', 'label', 'jobId'];

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
        questionJob = await this.findById(id).populate('jobId', '_id title');
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
  list({
    page = 1, perPage = 30, search, jobId
  }) {
    const reg = new RegExp(search, 'i');
    const querySearch = {
      $and: [{ label: reg }]
    };
    if (jobId !== undefined) querySearch.$and.push({ jobId });
    return this.find(querySearch)
      .populate('jobId', '_id title')
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
