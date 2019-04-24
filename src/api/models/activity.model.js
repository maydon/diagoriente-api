const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const types = ['professional', 'personal'];
/**
 * Activities Schema
 * @private
 */

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 250,
      trim: true,
      required: true
    },
    type: {
      type: String,
      enum: types,
      required: true
    },
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
    verified: {
      type: Boolean,
      required: true
    },
    search: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
activitySchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'title', 'type', 'interests', 'verified'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

activitySchema.statics = {
  types,
  /**
   * Get activity
   *
   * @param {ObjectId} id - The objectId of activity.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let activity;

      if (mongoose.Types.ObjectId.isValid(id)) {
        activity = await this.findById(id)
          .populate('interests', '_id nom rank')
          .exec();
      }
      if (activity) return activity;
      throw new APIError({
        message: 'Activity does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List activities in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of activities to be skipped.
   * @param {number} limit - Limit number of activities to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search, type }) {
    const reg = new RegExp(search, 'i');
    const reg1 = new RegExp(type, 'i');

    return this.find({
      $or: [{ title: reg }, { search: reg }],
      type: reg1
    })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Activity', activitySchema);
