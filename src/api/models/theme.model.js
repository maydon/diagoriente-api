const mongoose = require('mongoose');
const Activity = require('./activity.model');
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
      type: String,
      maxlength: 300
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
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    search: { type: String, trim: true },
    required: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competence' }]
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
      'activities',
      'required'
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
          .populate('activities', 'title type verified description')
          .populate('required')
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
   * import themes doc.
   *
   * @returns {Promise<Post[]>}
   */

  async importThemes(data) {
    try {
      const promisesActivities = data.map((item) => Activity.insertMany(item.activity));
      const allPromisesActivities = await Promise.all(promisesActivities);

      const promisesThemes = data.map((item, index) => {
        const themeToIsert = item;
        themeToIsert.activities = allPromisesActivities[index].map((x) => x._id);
        return this.insertMany(themeToIsert);
      });
      const allPromisesThemes = await Promise.all(promisesThemes);

      const importedThemes = {
        statuts: 'Themes file imported succesfully',
        themesNumber: allPromisesThemes.length
      };

      if (allPromisesThemes) {
        return importedThemes;
      }

      throw new APIError({
        message: 'Import theme error',
        status: httpStatus.NOT_ACCEPTABLE
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  /**
   * List themes in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<Post[]>}
   */
  list({
    page = 1, perPage = 30, search, type, role, population
  }) {
    const reg = new RegExp(search, 'i');
    const reg1 = new RegExp(type, 'i');
    const reg2 = { $in: ['professional', 'personal'] };
    const verified = role === 'admin' ? {} : { verified: true };

    const populateProp = population
      ? {
        path: 'activities',
        populate: { path: 'activities' }
      }
      : '';

    return this.find({
      $or: [{ title: reg }, { description: reg }, { search: reg }],
      type: type ? reg1 : reg2,
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
