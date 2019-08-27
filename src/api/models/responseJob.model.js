const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const types = ['professional', 'personal'];
/**
 * ResponseJobs Schema
 * @private
 */

const responseJobSchema = new mongoose.Schema(
  {
    response: {
      type: Boolean,
      required: true
    },
    parcourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcour' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    questionJobId: { type: mongoose.Schema.Types.ObjectId },
    questionJobLabel: { type: String, maxlength: 250, trim: true },
    description: { type: String, maxlength: 450, trim: true }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
responseJobSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'response', 'parcourId', 'jobId', 'questionJobId', 'questionJobLabel'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

responseJobSchema.statics = {
  types,
  /**
   * Get responseJob
   *
   * @param {ObjectId} id - The objectId of responseJob.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let responseJob;

      if (mongoose.Types.ObjectId.isValid(id)) {
        responseJob = await this.findById(id);
      }
      if (responseJob) return responseJob;
      throw new APIError({
        message: 'ResponseJob does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List responseJobs in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of responseJobs to be skipped.
   * @param {number} limit - Limit number of responseJobs to be returned.
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
 * @typedef Posts
 */

module.exports = mongoose.model('ResponseJob', responseJobSchema);
