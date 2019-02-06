const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * User Schema
 * @private
 */

const types = ['professional', 'personal', 'secteur'];

const themeSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
      default: null
    },
    title: {
      type: String,
      maxlength: 250,
      trim: true,
      required: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      enum: types,
      required: true
    },
    resources: {
      icon: {
        type: String
      },
      color: {
        type: String,
        maxlength: 10
      },
      backgroundColor: {
        type: String,
        maxlength: 10
      }
    },
    verified: {
      type: Boolean,
      default: true
    },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }]
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
themeSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'parentId',
      'title',
      'description',
      'type',
      'verified',
      'resources',
      'activities'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

themeSchema.statics = {
  types,
  /**
   * Get theme
   *
   * @param {ObjectId} id - The objectId of theme.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let theme;

      if (mongoose.Types.ObjectId.isValid(id)) {
        theme = await this.findById(id)
          .populate('activities', 'title type verified')
          .exec();
      }
      if (theme) return theme;

      throw new APIError({
        message: 'Theme does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List themes in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search, type, role, population }) {
    const reg = new RegExp(search, 'i');
    const reg1 = new RegExp(type, 'i');
    const verified = role === 'admin' ? {} : { verified: true };

    const populateProp = population
      ? {
          path: 'activities',
          populate: { path: 'activities' }
        }
      : '';

    return this.find({
      $or: [{ title: reg }, { description: reg }, { search: reg }],
      type: reg1,
      ...verified
    })
      .populate(populateProp)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * List secteurs in descending order of 'createdAt' timestamp.
   *
 
   */

  listSecteur({ parentId }) {
    return this.find({ parentId })
      .populate({
        path: 'activities',
        populate: { path: 'activities' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Theme', themeSchema);
