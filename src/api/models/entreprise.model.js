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
  }
});
/**
 * Methods
 */
entrepriseSchema.method({
  transform() {
    const transformed = {};
    const fields = ['commune_id', 'contract', 'latitude', 'longitude', 'distance', 'rome_codes'];

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

  list() {
    return this.find().exec();
  }
};
/**
 * @typedef Posts
 */

module.exports = mongoose.model('Entreprise', entrepriseSchema);
