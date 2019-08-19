const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * Inetersts Schema
 * @private
 */

const familySchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      maxlength: 200,
      trim: true,
      required: true
    },
    resources: [
      {
        name: {
          type: String
        },
        mimetype: {
          type: String
        },
        base64: {
          type: String
        }
      }
    ],
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }]
  },
  {
    timestamps: true
  }
);
familySchema.index({ createdAt: 1 });

/**
 * Methods
 */
familySchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'nom', 'interests', 'resources'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

familySchema.statics = {
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
        family = await this.findOne({ _id: id })
          .populate('interests', '_id nom rank')
          .exec();
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

  listFamiliesInterests(families) {
    return this.find({
      _id: {
        $in: families
      },
      resources: { $exists: true, $ne: [] }
    })
      .select('_id nom interests')
      .populate({
        path: 'interests',
        populate: { path: 'interests' },
        select: '_id nom'
      })
      .exec();
  },

  /**
   * List posts in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }, admin) {
    const reg = new RegExp(search, 'i');
    const querySearch = {
      $or: [{ nom: reg }, { rank: reg }]
    };
    if (admin) querySearch.resources = { $exists: true, $ne: [] };
    return this.find(querySearch)
      .populate('interests', '_id nom rank')
      .select('-resources')
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Family', familySchema);
