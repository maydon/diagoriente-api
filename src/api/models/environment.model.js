const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const types = ['professional', 'personal'];
/**
 * Environments Schema
 * @private
 */

const environmentSchema = new mongoose.Schema(
  {
    title: {
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
environmentSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'title'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

environmentSchema.statics = {
  types,
  /**
   * Get environment
   *
   * @param {ObjectId} id - The objectId of environment.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let environment;

      if (mongoose.Types.ObjectId.isValid(id)) {
        environment = await this.findById(id);
      }
      if (environment) return environment;
      throw new APIError({
        message: 'Environment does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List environments in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of environments to be skipped.
   * @param {number} limit - Limit number of environments to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');

    return this.find({ title: reg })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Environment', environmentSchema);
