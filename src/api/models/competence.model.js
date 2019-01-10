const mongoose = require('mongoose');

/**
 * Competence Schema
 * @private
 */

const competenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 20,
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
competenceSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'title', 'rank'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

competenceSchema.statics = {
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
