/* eslint-disable function-paren-newline */
const httpStatus = require('http-status');
const Job = require('../models/job.model');
const Favorite = require('../models/favorite.model');
const Parcour = require('../models/parcour.model');
const Family = require('../models/family.model');
const FamiliesRank = require('../models/familiesRank.model');
const { pagination } = require('../utils/Pagination');
const { addGlobals } = require('../middlewares/addGlobals');
const { matchingAlgo } = require('../middlewares/matchingAlgo');
const { normalize } = require('../utils/Normalize');
const { omit, uniq } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const job = await Job.get(id);
    req.locals = { job };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get theme
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const { user } = req;
    const { job } = req.locals;

    const favoriteJob = await Favorite.findOne({
      user: user._id,
      job: job._id
    });

    job.interested = null;
    job.favoriteId = null;

    if (favoriteJob) {
      job.interested = favoriteJob.interested;
      job.favoriteId = favoriteJob._id;
    }

    res.json(job.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Create new theme
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    req.body.search = normalize([title, description]);
    const job = new Job(req.body);
    const savedJob = await job.save();
    res.status(httpStatus.CREATED);
    res.json(savedJob.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Update  theme
 * @public
 */
exports.update = async (req, res, next) => {
  const { job } = req.locals;

  try {
    const { title, description } = req.body;
    req.body.search = normalize([title, description]);
    const newJob = omit(req.body, '_id');
    const updatedJob = Object.assign(job, newJob);
    const savedJob = await updatedJob.save();
    res.json(savedJob.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Post
 * @public
 */
exports.remove = async (req, res, next) => {
  const { job } = req.locals;

  try {
    job
      .remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch((e) => next(e));
  } catch (error) {
    next(error);
  }
};

/**
 * Get themes list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const jobs = await Job.list(req.query);
    const environmentsQuery = req.query.environments;
    const secteurQuery = req.query.secteur;
    const environments = environmentsQuery && JSON.parse(environmentsQuery);
    const secteur = secteurQuery && JSON.parse(secteurQuery);
    const transformedJobd = jobs.map((job) => job.transform());

    const { search } = req.query;
    const reg = new RegExp(search, 'i');
    const querySearch = {
      $and: [{ $or: [{ title: reg }, { description: reg }] }]
    };
    if (environments !== undefined) querySearch.$and.push({ environments: { $in: environments } });
    if (secteur !== undefined) querySearch.$and.push({ secteur: { $in: secteur } });
    const responsePagination = await pagination(transformedJobd, req.query, Job, querySearch);

    res.json(responsePagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Get myJobs recomandation
 * @public
 */

exports.myJob = async (req, res, next) => {
  try {
    const { parcourId, algoType } = req.query;
    const environmentsQuery = req.query.environments;
    const secteurQuery = req.query.secteur;
    const environments = environmentsQuery && JSON.parse(environmentsQuery);
    const secteur = secteurQuery && JSON.parse(secteurQuery);
    const { user } = req;
    const parcour = await Parcour.findById(parcourId);
    if (!parcour) {
      Parcour.parcourDosentExist(parcourId);
    }

    /* add globals interests and competences to parcour */
    const globalParcour = await addGlobals(parcour);
    const familiesRank = await FamiliesRank.find({});

    const { families } = globalParcour;

    const listFamiliesInterests = await Family.listFamiliesInterests(families);
    const formatFamilies = listFamiliesInterests.map((item, index) => ({
      _id: item._id,
      interests: item.interests[0].id,
      pExpInt: familiesRank[index].pExpInt
    }));

    const listInterestByFamilies = formatFamilies.map(
      // pick only the firt item interest in family
      (item) => item.interests
    );

    const listInterest = globalParcour.globalInterest.map((item) => item._id);
    /* suspectJobs contain jobs list that's */
    /* contain at least one interest form selected parcour */
    let suspectJobsSearchParam = null;
    if (algoType === Job.ALGO_TYPE[0]) {
      suspectJobsSearchParam = listInterest;
    } else if (algoType === Job.ALGO_TYPE[1]) {
      suspectJobsSearchParam = listInterestByFamilies;
    } else {
      suspectJobsSearchParam = uniq(listInterest.concat(listInterestByFamilies));
    }

    const querySearch = {
      $and: [{ 'interests._id': { $in: suspectJobsSearchParam } }]
    };
    if (environments !== undefined) querySearch.$and.push({ environments: { $in: environments } });
    if (secteur !== undefined) querySearch.$and.push({ secteur: { $in: secteur } });

    const suspectJobs = await Job.find(querySearch)
      .populate('secteur')
      .populate('environments', '_id title')
      .populate('interests._id', 'nom rank');
    const favoriteJobList = await Favorite.find({
      parcour: parcourId,
      user: user.role === 'user' ? user._id : parcour.userId
    });

    parcour.skills.forEach((skill) => {
      skill.competences.forEach((c) => {
        // eslint-disable-next-line no-param-reassign
        if (c.value === 5) c.value = 0;
      });
    });
    const myJobs = matchingAlgo(suspectJobs, parcour, formatFamilies, favoriteJobList, algoType);

    res.json(
      myJobs.map((job) => {
        const favorite = favoriteJobList.find((fav) => `${fav.job}` === `${job._id}`);
        if (favorite) favorite.environments = suspectJobs.find((sj) => `${sj.id}` === `${job._id}`);
        return {
          ...job,
          favoriteId: favorite ? favorite._id : null
        };
      })
    );
  } catch (error) {
    next(error);
  }
};
