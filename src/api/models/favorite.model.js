const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * Inetersts Schema
 * @private
 */

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parcour: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcour' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    interested: { type: Boolean }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
favoriteSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'user', 'parcour', 'job', 'interested'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

favoriteSchema.statics = {
  /**
   * Get interest
   *
   * @param {ObjectId} id - The objectId of interest.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let family;

      if (mongoose.Types.ObjectId.isValid(id)) {
        family = await this.findById(id)
          .populate('job', '_id title ')
          .exec();
      }
      if (family) return family;
      throw new APIError({
        message: 'Favorite does not exist',
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
  list({ page = 1, perPage = 30, _id }) {
    const search = _id ? { user: _id } : {};
    return this.find(search)
      .populate({
        path: 'job',
        model: 'Job',
        populate: { path: 'secteur', select: ' _id title' }
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

module.exports = mongoose.model('Favorite', favoriteSchema);
