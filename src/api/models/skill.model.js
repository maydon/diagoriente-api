const mongoose = require('mongoose');
const httpStatus = require('http-status');
const Theme = require('./theme.model');
const APIError = require('../utils/APIError');

/**
 * Skill Schema
 * @private
 */

const competencesValues = [1, 2, 3, 4];

const skillSchema = new mongoose.Schema(
  {
    parcourId: mongoose.Schema.Types.ObjectId,
    type: { type: String, enum: Theme.types },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    competences: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Competence' },
        value: { type: Number, enum: competencesValues, default: 1 }
      }
    ]
  },

  {
    timestamps: true
  }
);

/*
 *
 * populate skill properties
 * when listing  skills
 * doc
 *
 */

skillSchema.post('list', (doc, next) => {
  doc
    .populate('theme', 'title description type')
    .populate('activities', 'title type verified')
    .populate('competences._id', 'title rank')
    .execPopulate()
    .then(() => {
      next();
    });
});

/*
 *
 * populate skill properties
 * when creating new skill
 * doc
 *
 */

skillSchema.post('save', (doc, next) => {
  doc
    .populate('theme', 'title description type')
    .populate('activities', 'title type verified')
    .populate('competences._id', 'title rank')
    .execPopulate()
    .then(() => {
      next();
    });
});

/**
 * Methods
 */
skillSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'parcourId',
      'type',
      'theme',
      'activities',
      'competences'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

skillSchema.statics = {
  /**
   * Get skill
   *
   * @param {ObjectId} id - The objectId of skill.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let skill;

      if (mongoose.Types.ObjectId.isValid(id)) {
        skill = await this.findById(id).exec();
      }
      if (skill) return skill;

      throw new APIError({
        message: 'Skill does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List skills in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of skills to be skipped.
   * @param {number} limit - Limit number of skills to be returned.
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
 * @typedef Skills
 */

module.exports = mongoose.model('Skill', skillSchema);
