const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const entrepriseSchema = new mongoose.Schema({
  commune_id: {
    type: String
  },
  contract: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  distance: {
    type: Number
  },
  rome_codes: {
    type: String
  },
  rome_codes_keyword_search: {
    type: String
  }
});
/**
 * Methods
 */
entrepriseSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'commune_id',
      'contract',
      'latitude',
      'longitude',
      'distance',
      'rome_codes',
      'rome_codes_keyword_search'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});
entrepriseSchema.statics = {
  /**
   * Get entreprise
   *
   * @param {ObjectId} id - The objectId of commune.
   * @returns {Promise<Category, APIError>}
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

module.exports = mongoose.model('Entreprise', entrepriseSchema);
