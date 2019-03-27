const Parcour = require('../models/parcour.model');
const Skill = require('../models/skill.model');
const Competence = require('../models/competence.model');
const { flatten } = require('lodash');
const { reduceId } = require('../utils/reduceId');

/**
 * add global compentences and interest to parcour object
 * @public
 */
const addGlobals = async (entry) => {
  const parcour = entry;
  const skills = await Skill.find({
    _id: { $in: parcour.skills }
  })
    .populate('theme', 'title description type resources parentId')
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
    /* push individual intreests into globalInterests */
    const interests = item.activities.map((activity) => activity.interests);
    globalInterest = globalInterest.concat(flatten(interests));
    /* push individual intreests into globalInterests */

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

  return parcour;
};

exports.addGlobals = addGlobals;
