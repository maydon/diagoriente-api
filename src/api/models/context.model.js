const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const types = ['professional', 'personal'];
/**
 * Contexts Schema
 * @private
 */

const contextSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 250,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
contextSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'title', 'description'];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

contextSchema.statics = {
  types,
  /**
   * Get context
   *
   * @param {ObjectId} id - The objectId of context.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let context;

      if (mongoose.Types.ObjectId.isValid(id)) {
        context = await this.findById(id);
      }
      if (context) return context;
      throw new APIError({
        message: 'Context does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List contexts in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of contexts to be skipped.
   * @param {number} limit - Limit number of contexts to be returned.
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

module.exports = mongoose.model('Context', contextSchema);
