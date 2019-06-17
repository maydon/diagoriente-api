const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

/**
 * Competence Schema
 * @private
 */

const niveauCompetence = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 150,
    trim: true,
    required: true,
    default: ''
  },
  sub_title: {
    type: String,
    maxlength: 250,
    trim: true,
    default: ''
  }
});

const competenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 50,
      trim: true,
      required: true
    },
    rank: {
      type: String,
      required: true
    },
    niveau: {
      type: [niveauCompetence],
      default: [
        { title: '', sub_title: '' },
        { title: '', sub_title: '' },
        { title: '', sub_title: '' },
        { title: '', sub_title: '' }
      ]
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
competenceSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'title', 'rank', 'niveau'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

competenceSchema.statics = {
  async get(id) {
    try {
      let competence;

      if (mongoose.Types.ObjectId.isValid(id)) {
        competence = await this.findById(id);
      }
      if (competence) return competence;
      throw new APIError({
        message: 'Competence does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List competences in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of activities to be skipped.
   * @param {number} limit - Limit number of activities to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');
    return this.find({
      title: reg
    })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

module.exports = mongoose.model('Competence', competenceSchema);
