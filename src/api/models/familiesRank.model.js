const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * Inetersts Schema
 * @private
 */

const familyRankSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      min: 1,
      max: 5,
      unique: true,
      required: true
    },
    pExpInt: {
      type: Number,
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
familyRankSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'rank', 'pExpInt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

familyRankSchema.statics = {
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
        family = await this.findById(id).exec();
      }
      if (family) return family;
      throw new APIError({
        message: 'Family Interest does not exist',
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
 * @typedef Posts
 */

module.exports = mongoose.model('FamilyRank', familyRankSchema);
