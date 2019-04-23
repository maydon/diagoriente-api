const httpStatus = require('http-status');
const { omit, random } = require('lodash');
const bcrypt = require('bcryptjs');
const { mailer } = require('../middlewares/mailer');
const { pagination } = require('../utils/Pagination');
const User = require('../models/user.model');
const Parcour = require('../models/parcour.model');
const Question = require('../models/question.model');
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
    const newUserObject = omit(newUser.toObject(), ['_id', 'role']);

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
exports.update = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const { body, user: localUser } = req;

    if (user._id.toString() !== localUser._id.toString()) {
      User.forbidenUser();
    }
    // note : local user contain password hash
    if (body.password && localUser.password) {
      const oldHashedPassword = body.OldPassword;
      const existingHashedPassword = user.password;

      if (user.role === 'user') {
        const comparePasswords = await bcrypt.compare(
          oldHashedPassword,
          existingHashedPassword
        );
        if (!comparePasswords) {
          User.errorPassword();
        }
      }
      user.password = await hashPassword(body.password);
    }

    const userProp = {
      profile: {
        pseudo: body.pseudo || user.pseudo || null,
        firstName: body.firstName || user.firstName || null,
        lastName: body.lastName || user.lastName || null
      }
    };
    const newUser = Object.assign(user, userProp);

    const savedUser = await newUser.save();
    res.json(savedUser.transform());
  } catch (e) {
    next(e);
  }
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

    // throw error if user alrady exist
    //await User.checkDuplicateEmail(email, next);

    const parcour = await Parcour.find({ userId: user._id });
    user.email = email;
    user.password = await hashPassword(password);
    if (parcour.length > 0) {
      parcour[0].completed = true;
      const updateParcour = parcour[0];
      await updateParcour.save();
    }

    // send mail to new approuved user
    //await mailer(email, user);
    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (e) {
    next(e);
  }
};

exports.renewPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const token = await User.generateTokenUserPassword(email);
    const response = {
      email,
      ...token
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.renewPasswordBySecretQuestion = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    const { question } = user;

    if (!user && !question) {
      /* user question exist */
      await User.questionDosentExist();
    }

    const token = await User.generateTokenUserPassword(email);
    const randomQuestion = random(0, question.lenght - 1);
    const questionTitle = await Question.get(question[randomQuestion]._id);
    const response = {
      email,
      question: {
        _id: question[randomQuestion]._id,
        title: questionTitle.title
      },
      ...token
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.updatePasswordBySecretQuestion = async (req, res, next) => {
  try {
    const { question, email, token, password } = req.body;
    const user = await User.decodeTokenUserPassword(token);
    const { question: storedQuestion } = user;

    if (user && user.email === email) {
      const storedQuestionById = storedQuestion.filter(
        (item) => item._id === question._id
      );

      console.log('dif res', storedQuestionById);

      if (storedQuestionById[0].response === question.response) {
        user.password = await hashPassword(password);
      } else {
        await User.questionDosentExist();
      }
    }
    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.query;

    const user = await User.decodeTokenUserPassword(token);
    if (user) {
      user.password = await hashPassword(password);
    }

    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * register new user
 * @public
 */
exports.addUser = async (req, res, next) => {
  try {
    const {
      email,
      pseudo,
      password,
      firstName,
      lastName,
      question,
      uniqId,
      platform
    } = req.body;

    // throw error if email alrady exist
    await User.checkDuplicateEmail(email, next);

    const userProp = {
      uniqId,
      role: 'user',
      platform,
      email,
      question,
      password: await hashPassword(password),
      profile: {
        pseudo,
        firstName,
        lastName
      }
    };

    const newUser = new User(userProp);
    const savedUser = await newUser.save();
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
    const { body, user } = req;
    const { user: advisor } = req.locals;
    if (body.password) {
      const oldHashedPassword = body.OldPassword;
      const existingHashedPassword = advisor.password;

      if (user.role === 'advisor') {
        const comparePasswords = await bcrypt.compare(
          oldHashedPassword,
          existingHashedPassword
        );
        if (!comparePasswords) {
          User.errorPassword();
        }
      }
      advisor.password = await hashPassword(body.password);
    }

    const advisorProp = {
      profile: {
        pseudo: body.pseudo || advisor.pseudo || null,
        firstName: body.firstName || advisor.firstName || null,
        lastName: body.lastName || advisor.lastName || null,
        institution: body.institution || advisor.institution || null
      }
    };

    const newUser = Object.assign(advisor, advisorProp);

    const savedUser = await newUser.save();
    res.json(savedUser.transform());
  } catch (e) {
    next(e);
  }
};
