const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Job Schema
 * @private
 */

const jobSchema = new mongoose.Schema(
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
    interests: [],
    activities: [],
    formations: []
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
jobSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'title',
      'description',
      'interests',
      'activities',
      'formations'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

jobSchema.statics = {
  /**
   * Get job
   *
   * @param {ObjectId} id - The objectId of job.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let job;

      if (mongoose.Types.ObjectId.isValid(id)) {
        job = await this.findById(id).exec();
      }
      if (job) return job;

      throw new APIError({
        message: 'Job does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List Jobs in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of jobs to be skipped.
   * @param {number} limit - Limit number of jobs to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    console.log('search ___ search ____ ');
    const reg = new RegExp(search, 'i');
    return this.find({
      $or: [{ title: reg }, { description: reg }]
    })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Jobs
 */

module.exports = mongoose.model('Job', jobSchema);
