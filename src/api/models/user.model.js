const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const APIError = require('../utils/APIError');
const { jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 * User Platforms
 */
const platform = ['android', 'ios'];
/**
 * User Schema
 * @private
 */

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    platform: {
      type: String,
      enum: platform,
      default: 'android'
    },
    uniqId: {
      type: String,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      trim: true
    },
    parcours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parcours' }]
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'uniqId',
      'role',
      'email',
      'platform',
      'parcours',
      'createdAt'
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment()
        .add(jwtExpirationInterval, 'minutes')
        .unix(),
      iat: moment().unix(),
      sub: this._id
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
});

/**
 * Statics
 */
userSchema.statics = {
  roles,
  platform,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by uniqId and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { uniqId } = options;
    if (!uniqId) {
      throw new APIError({
        message: 'An uniqId is required to generate a token'
      });
    }
    let user = await this.findOne({ uniqId });
    if (!user) {
      user = await this.create(options);
    }
    return { user, accessToken: user.token() };
  },

  /**
   * Find admin by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */

  async findAdminAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) {
      throw new APIError({
        message: 'An email is required to generate a token'
      });
    }
    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect userId or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ page = 1, perPage = 30, role }) {
    return this.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
