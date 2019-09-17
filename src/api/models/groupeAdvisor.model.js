const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * groupes Schema
 * @private
 */

const groupeSchema = new mongoose.Schema(
  {
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: {
      type: String,
      maxlength: 250,
      trim: true,
      required: true
    },
    code: {
      type: String,
      maxlength: 8,
      trim: true,
      required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    search: { type: String, trim: true }
  },

  {
    timestamps: true
  }
);

/**
 * Methods
 */
groupeSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'advisorId', 'title', 'code', 'users'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

groupeSchema.statics = {
  /**
   * Get groupe
   *
   * @param {ObjectId} id - The objectId of groupe.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let groupe;

      if (mongoose.Types.ObjectId.isValid(id)) {
        groupe = await this.findById(id);
      }
      if (groupe) return groupe;
      throw new APIError({
        message: 'Groupe does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List groupes in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of groupes to be skipped.
   * @param {number} limit - Limit number of groupes to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');
    return this.find({ search: reg })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
  async groupeDosentExist(code) {
    try {
      const groupe = await this.findOne({ code }).exec();
      if (!groupe) {
        throw new APIError({
          message: 'invalid Code or Groupe doest not exist',
          status: httpStatus.CONFLICT
        });
      }
    } catch (e) {
      throw e;
    }
  }
};

/**
 * @typedef Posts
 */

module.exports = mongoose.model('Groupe', groupeSchema);
