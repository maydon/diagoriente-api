const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const communeSchema = new mongoose.Schema({
  Code_commune_INSEE: {
    type: String
  },
  Nom_commune: {
    type: String
  },
  Code_postal: {
    type: Number
  },
  Libelle_acheminement: {
    type: String
  },
  coordonnees_gps: {
    type: String
  },
  Ligne_5: {
    type: String
  },
  search: { type: String, trim: true }
});
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

  list({ page = 1, perPage = 200, search }) {
    const reg = new RegExp(search, 'i');
    return this.find({
      $or: [{ Code_commune_INSEE: reg }, { search: reg }]
    })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};
/**
 * @typedef Posts
 */

module.exports = mongoose.model('Commune', communeSchema);
