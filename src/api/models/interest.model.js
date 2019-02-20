const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * Inetersts Schema
 * @private
 */

const interestSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      maxlength: 30,
      trim: true,
      required: true
    },
    rank: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
interestSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'nom', 'rank'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

interestSchema.statics = {
  /**
   * Get interest
   *
   * @param {ObjectId} id - The objectId of interest.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let interest;

      if (mongoose.Types.ObjectId.isValid(id)) {
        interest = await this.findById(id).exec();
      }
      if (interest) return interest;
      throw new APIError({
        message: 'Interest does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * list of
   * interest
   * @returns {Promise<Post[]>}
   */
  listRank() {
    return this.find({}).select('rank');
  },

  /**
   * key value format
   * interest
   */
  objectListRank(list) {
    return list.reduce((acc, obj) => {
      const key = obj.rank;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key] = obj._id;
      return acc;
    }, {});
  },

  /**
   * find interrest
   * highest rank
   *
   * @returns {Promise<Post[]>}
   */
  highestRank(list) {
    return Math.max.apply(null, list.map((e) => Number(e.rank)));
  },
  /**
   * List posts in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');
    return this.find({
      $or: [{ nom: reg }, { rank: reg }]
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

module.exports = mongoose.model('Interest', interestSchema);
