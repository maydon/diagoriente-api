const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { flatten } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Parcours Schema
 * @private
 */

const parcourSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    completed: {
      type: Boolean,
      default: false
    },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }]
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
parcourSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'userId',
      'completed',
      'skills',
      'globalCopmetences'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

parcourSchema.statics = {
  /**
   * Get parcour
   *
   * @param {ObjectId} id - The objectId of parcour.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let parcour;
      if (mongoose.Types.ObjectId.isValid(id)) {
        parcour = await this.findById(id).exec();
      }
      if (parcour) return parcour;
      throw new APIError({
        message: 'Parcour does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * add global
   * competences to parcour and
   * insialize list of competences
   */
  AddGlobalCompetence({ skills, competencesCart }) {
    const competencesCartInitialized = {};

    competencesCart.map((item) => {
      const keyItem = item._id;
      competencesCartInitialized[keyItem] = { _id: keyItem, value: 0 };
    });

    const competences = flatten(skills.map((item) => item.competences));

    competences.forEach((item) => {
      const refItem = competencesCartInitialized[item._id];
      if (refItem.value < item.value) {
        competencesCartInitialized[item._id] = item;
      }
    });

    return Object.values(competencesCartInitialized);
  },
  /**
   * List parcours in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of parcours to be skipped.
   * @param {number} limit - Limit number of parcours to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, role, _id }) {
    const userId = role === 'admin' ? {} : { userId: _id };
    return this.find({ ...userId })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Parcours
 */

module.exports = mongoose.model('Parcour', parcourSchema);
