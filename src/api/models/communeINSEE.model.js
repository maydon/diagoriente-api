const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const communeSchema = new mongoose.Schema(
  {
    code_INSEE: {
      type: Number,
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    code_postal: {
      type: Number,
      required: true
    },
    libelle: {
      type: String,
      required: true
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
    const fields = ['code_INSEE', 'nom', 'code_postal', 'libelle'];

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
  list({
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
  }
};
/**
 * @typedef Posts
 */

module.exports = mongoose.model('Commune', communeSchema);
