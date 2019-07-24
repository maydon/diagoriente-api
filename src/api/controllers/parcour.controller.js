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
    const skills = await Skill.find({
      _id: { $in: parcour.skills }
    }).populate({ path: 'theme', select: 'title' });
    globalParcour.globalCopmetences.forEach((c) => {
      c.taux = Math.round((c.count * 100) / parcour.skills.length);
      const themes = new Set();
      skills.forEach((skill) => {
        skill.competences.forEach((skc) => {
          if (c._id.toString() === skc._id.toString()) themes.add(skill.theme.title);
        });
      });
      c.themes = Array.from(themes);
    });

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
    let advisorChange = false;

    const userParcour = await Parcour.findOne({ userId: user._id }).populate({
      path: 'skills',
      select: '-createdAt -updatedAt -__v',
      populate: { path: 'theme activities', select: '-createdAt -updatedAt -__v' }
    });

    if (userParcour) {
      if (!userParcour.advisorId && req.body.advisorId) {
        await userParcour.update({ advisorId: req.body.advisorId });
        advisorChange = true;
      }
      parcourResponse = userParcour;

      res.status(httpStatus.OK);
    } else {
      const parcour = new Parcour({ userId: user._id, played: false, ...req.body });

      parcourResponse = await parcour.save();
      res.status(httpStatus.CREATED);
    }

    const result = parcourResponse.transform();
    if (advisorChange) {
      result.advisorId = req.body.advisorId;
    }
    res.json(result);
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
    const { skills, played, families } = req.body;
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
    if (families) updateObject.families = families;

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

exports.updateCompetences = async (req, res, next) => {
  const { parcour } = req.locals;
  const { competences } = req.body;
  try {
    const skills = await Skill.find({
      _id: { $in: parcour.skills }
    });
    const updatedSkills = [];
    skills.forEach((skill) => {
      skill.competences.forEach((c) => {
        const nc = competences.find((com) => com._id.toString() === c._id.toString());
        if (nc) {
          c.value = nc.value;
          updatedSkills.push(Skill.updateOne({ _id: skill._id }, skill));
        }
      });
    });
    await Promise.all(updatedSkills);
    const savedParcour = await Parcour.findById(parcour._id).populate({
      path: 'skills',
      select: '-createdAt -updatedAt -__v',
      populate: { path: 'theme activities', select: '-createdAt -updatedAt -__v' }
    });
    res.json(savedParcour.transform());
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
