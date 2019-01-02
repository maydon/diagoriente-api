const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Formation Schema
 * @private
 */

const formationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 20,
      trim: true,
      required: true
    },
    description: {
      type: String,
      maxlength: 120
    },
    establishment: {
      type: String,
      maxlength: 120
    },
    adress: {
      adress: {
        type: String,
        maxlength: 40
      },
      postalCode: {
        type: String,
        maxlength: 20
      },
      country: {
        type: String,
        maxlength: 20
      }
    },
    contact: {
      email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        trim: true,
        lowercase: true
      },
      webAdress: {
        type: String,
        maxlength: 20
      },
      phone: {
        type: String,
        maxlength: 20
      }
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
formationSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'title',
      'description',
      'establishment',
      'adress',
      'contact'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

formationSchema.statics = {
  /**
   * Get formation
   *
   * @param {ObjectId} id - The objectId of formation.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let formation;

      if (mongoose.Types.ObjectId.isValid(id)) {
        formation = await this.findById(id).exec();
      }
      if (formation) return formation;

      throw new APIError({
        message: 'Theme does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List formations in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of sormations to be skipped.
   * @param {number} limit - Limit number of formations to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');
    return this.find({
      $or: [{ title: reg }, { description: reg }]
    })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Formations
 */

module.exports = mongoose.model('Formation', formationSchema);
