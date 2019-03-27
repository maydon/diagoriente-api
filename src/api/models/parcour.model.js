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
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completed: {
      type: Boolean,
      default: false
    },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    families: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Family' }]
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
      'advisorId',
      'userId',
      'completed',
      'skills',
      'families',
      'globalCopmetences',
      'globalInterest',
      'createdAt',
      'updatedAt'
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
      competencesCartInitialized[keyItem] = {
        _id: keyItem,
        value: 0,
        count: 0
      };
    });

    const competences = flatten(skills.map((item) => item.competences));
    competences.forEach((item) => {
      const refItem = competencesCartInitialized[item._id];

      /* increment count if competence is duplicated with positive velue */
      if (item.value > 0) {
        refItem.count += 1;
      }
      /* increment count if competence is duplicated with positive velue */

      /* pick max value competences */
      if (refItem.value < item.value) {
        competencesCartInitialized[item._id].value = item.value;
      }
      /* pick max value competences */
    });

    return Object.values(competencesCartInitialized);
  },

  /**
   * 
   * throw error
   * undefined parcour
   *
 
   */
  parcourDosentExist(id) {
    throw new APIError({
      message: `Parcour id : ${id} dosent exist`,
      status: httpStatus.NOT_FOUND
    });
  },
  /**
   * List parcours in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of parcours to be skipped.
   * @param {number} limit - Limit number of parcours to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, role, _id }) {
    const RolesSearch = {
      admin: {},
      advisor: { advisorId: _id },
      user: { userId: _id }
    };

    const querySearch = { ...RolesSearch[role] };
    return this.find({ ...querySearch })
      .populate('userId', 'uniqId email platform profile')
      .populate('advisorId', 'email profile')
      .sort({ updatedAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Parcours
 */

module.exports = mongoose.model('Parcour', parcourSchema);
