/* eslint-disable consistent-return */
const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Parcour = require('../models/parcour.model');
const Skill = require('../models/skill.model');

const User = require('../models/user.model');
const { addGlobals } = require('../middlewares/addGlobals');
const { pick, differenceBy } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load parcour and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const parcour = await Parcour.get(id);
    req.locals = { parcour };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get parcour
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const { parcour } = req.locals;
    const globalParcour = await addGlobals(parcour);
    return res.json(globalParcour.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Create new parcour
 * @public
 */
exports.create = async (req, res, next) => {
  const { user } = req;
  try {
    let parcourResponse = null;

    const userParcour = await Parcour.findOne({ userId: user._id }).populate({
      path: 'skills',
      select: '-createdAt -updatedAt -__v',
      populate: { path: 'theme activities', select: '-createdAt -updatedAt -__v' }
    });

    if (userParcour) {
      parcourResponse = userParcour;

      res.status(httpStatus.OK);
    } else {
      const parcour = new Parcour({ userId: user._id, played: false, ...req.body });

      parcourResponse = await parcour.save();
      res.status(httpStatus.CREATED);
    }
    res.json(parcourResponse.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  parcour
 * @public
 */
exports.update = async (req, res, next) => {
  const { parcour } = req.locals;

  try {
    const { skills, played } = req.body;
    let skillsResult = null;
    if (skills) {
      const parcourSkills = await Skill.find({ parcourId: parcour._id });
      const skillsToAdd = skills.filter(({ theme }) => !parcourSkills.find((sk) => sk.theme === theme));

      const skillsToUpdate = skills.filter(({ theme }) =>
        parcourSkills.find((row) => row.theme === theme));
      const skillsToDelete = differenceBy(
        skills,
        [...skillsToAdd, ...skillsToUpdate],
        ({ theme }) => theme
      ).map(({ theme }) => parcourSkills.find((skill) => skill.theme === theme));

      const addPromise = skillsToAdd.map((sk) => {
        const skill = new Skill({ ...sk, parcourId: parcour._id });
        return skill.save();
      });

      const updatePromise = skillsToUpdate.map((sk) => {
        const skill = parcourSkills.find(({ theme }) => sk.theme === theme);
        return skill.updateOne({ competences: sk.competences, activities: sk.activities });
      });

      const deletePromise = skillsToDelete.map((skill) => skill.remove());
      skillsResult = await Promise.all([...addPromise, ...updatePromise, ...deletePromise]);
    }

    const updateObject = {};

    if (played) updateObject.played = played;
    if (skillsResult) updateObject.skills = skillsResult;
    console.log({ updateObject });

    const currentParcours = await Parcour.findOneAndUpdate({ _id: parcour._id }, updateObject, {
      new: true
    }).populate({
      path: 'skills',
      select: '-createdAt -updatedAt -__v',
      populate: { path: 'theme activities', select: '-createdAt -updatedAt -__v' }
    });

    res.json(currentParcours.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * add families to Parcour
 * @public
 */

exports.addFamilies = async (req, res, next) => {
  const { parcour } = req.locals;
  try {
    const newParcour = pick(req.body, ['families']);
    const updatedParcour = Object.assign(parcour, newParcour);
    const savedParcour = await updatedParcour.save();
    res.json(savedParcour.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete parcour
 * @public
 */
exports.remove = async (req, res, next) => {
  const { parcour } = req.locals;
  try {
    await User.findOneAndUpdate(
      { _id: parcour.userId },
      {
        $pull: { parcours: parcour._id }
      }
    );
    parcour
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get parcours list
 * @public
 */
exports.list = async (req, res, next) => {
  const { role, _id } = req.user;

  try {
    const parcours = await Parcour.list({
      ...req.query,
      role,
      _id
    });
    const transformedParcours = parcours.map((parcour) => parcour.transform());

    const RolesSearch = {
      admin: {},
      advisor: { advisorId: _id },
      user: { userId: _id }
    };

    const querySearch = { ...RolesSearch[role] };

    const responstPagination = await pagination(
      transformedParcours,
      req.query,
      Parcour,
      querySearch
    );

    res.json(responstPagination);
  } catch (error) {
    next(error);
  }
};
