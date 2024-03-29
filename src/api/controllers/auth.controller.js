const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { jwtExpirationInterval } = require('../../config/vars');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    if (user.role !== 'user') {
      throw new APIError({
        message: 'Email ou mot de passe incorrect',
        status: httpStatus.UNAUTHORIZED
      });
    }
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.loginAdmin = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAdminAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, admin: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.loginAdvisor = async (req, res, next) => {
  try {
    const { advisor, accessToken } = await User.findAdvisorAndGenerateToken(req.body);
    const token = generateTokenResponse(advisor, accessToken);
    const advisorTransformed = advisor.transform();
    return res.json({ token, advisor: advisorTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { userId, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndDelete({
      userId,
      token: refreshToken
    });

    const { email, uniqId, role } = await User.get(userId);

    let globals = null;
    if (role === 'admin' || role === 'advisor') {
      globals = await User.findAdminAndGenerateToken({
        email,
        refreshObject
      });
    } else {
      globals = await User.findAndGenerateToken({
        uniqId,
        refreshObject
      });
    }

    const { user, accessToken } = globals;

    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
