const httpStatus = require('http-status');
const { omit } = require('lodash');
const { pagination } = require('../utils/Pagination');
const User = require('../models/user.model');
const Parcour = require('../models/parcour.model');
const { hashPassword } = require('../utils/Bcrypt');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const { role } = req.query;

    const reg = new RegExp(role, 'i');

    const users = await User.list({ ...req.query, role });

    const transformedUsers = users.map((user) => user.transform());

    const querySearch = { role: reg };

    const responstPagination = await pagination(
      transformedUsers,
      req.query,
      User,
      querySearch
    );

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};

/**
 * approuve user
 * @public
 */
exports.aprouvedUser = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const { email, pseudo, password, firstName, lastName } = req.body;

    user.profile = {
      pseudo,
      firstName,
      lastName
    };
    const parcour = await Parcour.find({ userId: user._id });
    user.email = email;
    user.password = await hashPassword(password);
    if (parcour.length > 0) {
      parcour[0].completed = true;
      const updateParcour = parcour[0];
      await updateParcour.save();
    }

    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (e) {
    next(e);
  }
};

/**
 * add advisor
 * @public
 */
exports.addAdvisor = async (req, res, next) => {
  try {
    const { body } = req;
    await User.checkDuplicateEmail(body.email, next);

    const advisorProp = {
      role: 'advisor',
      platform: 'web',
      email: body.email,
      password: await hashPassword(body.password),
      profile: {
        pseudo: body.pseudo,
        firstName: body.firstName,
        lastName: body.lastName,
        institution: body.institution
      }
    };

    const advisor = new User(advisorProp);
    advisor.parcours = undefined;
    const savedAdvisor = await advisor.save();
    res.status(httpStatus.CREATED);
    res.json(savedAdvisor.transform());
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * patch advisor
 * @public
 */

exports.updateAdvisor = async (req, res, next) => {
  try {
    const { body } = req;
    const { user: advisor } = req.locals;
    if (body.password) {
      const oldHashedPassword = await hashPassword(body.OldPassword);
      const newHashedPassword = await hashPassword(body.password);
      const existingHashedPassword = advisor.password;

      if (existingHashedPassword !== oldHashedPassword) {
        // console.log('oldHashedPassword', oldHashedPassword);
        //console.log('existingHashedPassword', existingHashedPassword);

        User.errorPassword();
      }
      advisor.password = await hashPassword(newHashedPassword);
    }

    const advisorProp = {
      profile: {
        pseudo: body.pseudo || advisor.pseudo || null,
        firstName: body.firstName || advisor.firstName || null,
        lastName: body.lastName || advisor.lastName || null,
        institution: body.institution || advisor.institution || null
      }
    };

    const user = Object.assign(advisor, advisorProp);

    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (e) {
    next(e);
  }
};
