const httpStatus = require('http-status');
const Skill = require('../models/skill.model');
const Parcour = require('../models/parcour.model');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load skill and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const skill = await Skill.get(id);
    req.locals = { skill };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get skill
 * @public
 */
exports.get = (req, res) => res.json(req.locals.skill.transform());

/**
 * Create new skill
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const skill = new Skill(req.body);
    console.log('skill', skill.theme);

    const parcour = await Parcour.findById(skill.parcourId);
    const parcourWithThemes = await Parcour.findById(skill.parcourId).populate(
      'skills',
      'theme'
    );
    const listThemesInParcour = parcourWithThemes.skills.map((item) =>
      item.theme.toString()
    );
    const skillDuplicated = listThemesInParcour.includes(
      skill.theme.toString()
    );
    if (skillDuplicated) {
      const duplicatedSkillId = parcourWithThemes.skills.filter(
        (item) => item.theme.toString() === skill.theme.toString()
      );
      parcour.skills.filter(
        (item) => item.id.string() === duplicatedSkillId[0]._id
      );
    }
    const savedSkill = await skill.save();
    parcour.skills.push(savedSkill._id);
    await parcour.save();
    res.status(httpStatus.CREATED);
    res.json(savedSkill.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  skill
 * @public
 */
exports.update = async (req, res, next) => {
  const { skill } = req.locals;

  try {
    const newSkill = omit(req.body, ['_id', 'parcourId']);
    const updatedSkill = Object.assign(skill, newSkill);
    const savedSkill = await updatedSkill.save();
    res.json(savedSkill.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Skill
 * @public
 */
exports.remove = async (req, res, next) => {
  const { skill } = req.locals;

  try {
    skill
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get skills list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const skills = await Skill.list(req.query);
    const transformedSkills = skills.map((skill) => skill.transform());
    res.json(transformedSkills);
  } catch (error) {
    next(error);
  }
};
