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
const roles = ['user', 'admin', 'advisor'];

/**
 * User Platforms
 */
const platform = ['android', 'ios', 'web'];
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
      required: true
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
      lowercase: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      trim: true
    },
    profile: {
      pseudo: {
        type: String,
        trim: true
      },
      firstName: {
        type: String,
        trim: true,
        max: 30
      },
      lastName: {
        type: String,
        trim: true,
        max: 30
      },
      institution: {
        type: String,
        trim: true,
        max: 30
      }
    },
    parcours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parcour' }]
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
      'profile',
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

  tokenUserPassword(expirationInterval) {
    const playload = {
      exp: moment()
        .add(expirationInterval, 'minutes')
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
    const { uniqId, email, password } = options;
    if (!uniqId && !email) {
      throw new APIError({
        message: 'An uniqId or email is required to generate a token'
      });
    }
    let user = null;
    if (email) {
      user = await this.findOne({ email });
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      throw new APIError({
        message: 'Incorrect email or password',
        status: httpStatus.UNAUTHORIZED
      });
    } else {
      user = await this.findOne({ uniqId });
      if (!user) {
        user = await this.create(options);
      }
      return { user, accessToken: user.token() };
    }
  },

  /**
   * renew passwrod and generate new renew password token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async generateTokenUserPassword(email) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new APIError({
        message:
          'user with valid email is required to generate a renewPasswordtoken',
        status: httpStatus.UNAUTHORIZED
      });
    }
    // Generate renewPasswordToken min token with 60 min validity
    return { token: user.tokenUserPassword(60) };
  },

  async decodeTokenUserPassword(token) {
    try {
      const decode = jwt.decode(token, jwtSecret);
      const user = await this.findOne({ _id: decode.sub });
      return user;
    } catch (error) {
      console.log(error);
      throw new APIError({
        message: error.message
      });
    }
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
      if (
        user &&
        user.role === 'admin' &&
        (await user.passwordMatches(password))
      ) {
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
      err.message = 'Incorrect admin email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * Find admin by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */

  async findAdvisorAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    const advisor = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (
        advisor &&
        advisor.role === 'advisor' &&
        (await advisor.passwordMatches(password))
      ) {
        return { advisor, accessToken: advisor.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { advisor, accessToken: advisor.token() };
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
    const reg = new RegExp(role, 'i');

    const querySearch = { role: reg };

    return this.find({ ...querySearch })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * incorect existing
   * password
   */
  errorPassword() {
    throw new APIError({
      message: 'new password dosent match the old one ',
      status: httpStatus.CONFLICT
    });
  },

  forbidenUser() {
    throw new APIError({
      message: 'id user and token dosent match ',
      status: httpStatus.CONFLICT
    });
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  async checkDuplicateEmail(email, next) {
    try {
      const user = await this.findOne({ email }).exec();
      if (user) {
        throw new APIError({
          message: 'email already exists',
          status: httpStatus.CONFLICT
        });
      }
    } catch (e) {
      throw e;
    }
  }
};

/** 5c8f56f69bf39b6e1b6a9e19
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
