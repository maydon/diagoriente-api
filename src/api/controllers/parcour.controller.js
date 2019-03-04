const httpStatus = require('http-status');
const { pagination } = require('../utils/Pagination');
const Parcour = require('../models/parcour.model');
const Skill = require('../models/skill.model');
const User = require('../models/user.model');
const Competence = require('../models/competence.model');
const { reduceId } = require('../utils/reduceId');
const { omit, flatten } = require('lodash');
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

    const skills = await Skill.find({
      _id: { $in: parcour.skills }
    })
      .populate('theme', 'title description type')
      .populate({
        path: 'activities',
        model: 'Activity',
        populate: {
          path: 'interests',
          model: 'Interest',
          select: 'rank nom'
        }
      });

    const staticCompentences = await Competence.find({}).select('_id');
    let globalInterest = [];

    const formatSkills = skills.map((item) => {
      const interests = item.activities.map((activity) => activity.interests);

      globalInterest = globalInterest.concat(flatten(interests));
      const competencesList = Parcour.AddGlobalCompetence({
        skills: [item],
        competencesCart: staticCompentences
      });
      item.competences = competencesList;
      return item;
    });

    parcour.globalInterest = reduceId(globalInterest, '_id');
    parcour.skills = formatSkills;
    parcour.globalCopmetences = Parcour.AddGlobalCompetence({
      skills: parcour.skills,
      competencesCart: staticCompentences
    });

    return res.json(parcour.transform());
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

    const userParcour = await Parcour.findOne({ userId: user._id });

    if (userParcour) {
      parcourResponse = userParcour;

      res.status(httpStatus.OK);
    } else {
      const parcour = new Parcour({ userId: user._id, ...req.body });

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
    const newParcour = omit(req.body, ['_id', 'userId', 'advisorId']);
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

    let userId = role === 'admin' ? {} : { userId: _id };
    userId = role === 'advisor' ? { advisorId: _id } : { userId: _id };

    const querySearch = { ...userId };

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
