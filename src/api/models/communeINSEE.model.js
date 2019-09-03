const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const communeSchema = new mongoose.Schema(
  {
    Code_commune_INSEE: {
      type: Number,
      required: true
    },
    Nom_commune: {
      type: String,
      required: true
    },
    Code_postal: {
      type: Number,
      required: true
    },
    Libelle_acheminement: {
      type: String,
      required: true
    },
    coordonnees_gps: {
      type: String,
      required: true
    },
    Ligne_5: {
      type: String
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
communeSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'Code_commune_INSEE',
      'Nom_commune',
      'Code_postal',
      'Libelle_acheminement',
      'Ligne_5',
      'coordonnees_gps'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});
communeSchema.statics = {
  /**
   * Get commune
   *
   * @param {ObjectId} id - The objectId of commune.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let commune;

      if (mongoose.Types.ObjectId.isValid(id)) {
        commune = await this.findById(id).exec();
      }
      if (commune) return commune;
      throw new APIError({
        message: 'Commune does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /*   list({
    page = 1, perPage = 30, search, type
  }) {
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
  } */
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

module.exports = mongoose.model('Commune', communeSchema);
