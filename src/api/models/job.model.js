const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
 * Job Schema
 * @private
 */

const jobSchema = new mongoose.Schema(
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
    search: {
      type: String,
      maxlength: 140
    },
    interests: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest' },
        weight: { type: Number, min: 0, max: 1 }
      }
    ],
    competences: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Competence' },
        weight: { type: Number, min: 0, max: 1 }
      }
    ],
    formations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }]
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
jobSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'title',
      'description',
      'interests',
      'competences',
      'formations'
    ];

    fields.forEach((field) => {
      if (field === 'interests') {
        transformed[field] = this[field].map((item) => {
          return {
            _id: item._id._id,
            rank: item._id.rank,
            nom: item.nom,
            weight: item.weight
          };
        });
      } else if (field === 'competences') {
        transformed[field] = this[field].map((item) => {
          return {
            _id: item._id._id,
            rank: item._id.rank,
            title: item.title,
            weight: item.weight
          };
        });
      } else {
        transformed[field] = this[field];
      }
    });

    return transformed;
  }
});

jobSchema.statics = {
  /**
   * Get job
   *
   * @param {ObjectId} id - The objectId of job.
   * @returns {Promise<Category, APIError>}
   */
  async get(id) {
    try {
      let job;

      if (mongoose.Types.ObjectId.isValid(id)) {
        job = await this.findById(id)
          .populate('interests._id')
          .populate('competences._id', '_id title rank')
          .exec();
      }
      if (job) return job;

      throw new APIError({
        message: 'Job does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List Jobs in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of jobs to be skipped.
   * @param {number} limit - Limit number of jobs to be returned.
   * @returns {Promise<Post[]>}
   */
  list({ page = 1, perPage = 30, search }) {
    const reg = new RegExp(search, 'i');
    return this.find({
      $or: [{ title: reg }, { description: reg }]
    })
      .populate('interests._id')
      .populate('competences._id', '_id title rank')
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Jobs
 */

module.exports = mongoose.model('Job', jobSchema);
