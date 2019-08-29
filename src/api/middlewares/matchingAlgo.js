const math = require('mathjs');
const Job = require('../models/job.model');
const { reduceJobs } = require('../utils/reduceId');

const formatToObject = (data) => {
  const formatObjectDate = {};

  data.forEach((item) => {
    formatObjectDate[item.interests] = item;
  });
  return formatObjectDate;
};

const addJpInts = (data) => {
  const formatDate = {
    globalCount: data.reduce((acc, val) => acc + val.count, 0),
    interests: data
  };

  const formatObjectDate = {};

  formatDate.interests.forEach((item) => {
    if (item.count > 0) {
      const f = math.fraction(item.count, formatDate.globalCount);
      // eslint-disable-next-line no-param-reassign
      item.jpInt = math.number(f);
    } else {
      // eslint-disable-next-line no-param-reassign
      item.jpInt = 0;
    }
    formatObjectDate[item._id] = item;
  });

  return formatObjectDate;
};

const addJpComps = (data) => {
  const formatDate = {
    globalCount: data.reduce((acc, val) => acc + val.count, 0),
    competences: data
  };

  const formatObjectDate = {};

  formatDate.competences.forEach((item) => {
    if (item.count > 0) {
      const f = math.fraction(item.count, formatDate.globalCount);
      // eslint-disable-next-line no-param-reassign
      item.jpComp = math.number(f);
    } else {
      // eslint-disable-next-line no-param-reassign
      item.jpComp = 0;
    }
    formatObjectDate[item._id] = item;
  });

  return formatObjectDate;
};

const sorteJobsByHigerRank = (job, JpInts, JpComps) => {
  let jobRank = 0;

  job.interests.forEach((interest) => {
    console.log('in**', jobRank);
    if (interest._id._id in JpInts) {
      const m = math.multiply(JpInts[interest._id._id].jpInt, interest.weight);

      jobRank += math.number(m);
      console.log('end**', jobRank);
    }
    console.log('out**', jobRank);
  });

  job.competences.forEach((competence) => {
    if (competence._id in JpComps) {
      const m = math.multiply(JpComps[competence._id].jpComp, competence.weight);

      jobRank += math.number(m);
    }
  });

  return Number(jobRank.toFixed(3));
};

const sorteJobsByFamilyHigerRank = (job, pExpInt) => {
  let jobRank = 0;
  job.interests.forEach((interest) => {
    if (interest._id._id in pExpInt) {
      const m = math.multiply(pExpInt[interest._id._id].pExpInt, interest.weight);
      jobRank += math.number(m);
    }
  });

  return Number(jobRank.toFixed(3));
};

const getInterestedParam = (favorite, jobId) => {
  let interestedParam = null;
  favorite.forEach((item) => {
    if (item.job.toString() === jobId.toString()) {
      interestedParam = item.interested;
    }
  });
  return interestedParam;
};

/**
 * matching jobs with user parcour
 * @public
 */
const matchingAlgoByInterest = (jobs, parcour, favorite) => {
  /* algoType : the way that we use to display the matching algoritm */
  /* algoType one of ['interst', 'family', 'interest_family'] */

  /* here we should calculate jobs olgo */

  const jobsliste = [];
  const { globalInterest, globalCopmetences } = parcour;

  const JpInts = addJpInts(globalInterest);
  const JpComps = addJpComps(globalCopmetences);

  jobs.forEach((job) => {
    const newJob = {
      jobRank: sorteJobsByHigerRank(job, JpInts, JpComps),
      interested: getInterestedParam(favorite, job._id),
      ...job.toObject()
    };
    jobsliste.push(newJob);
  });

  const sortedJobs = jobsliste.sort((a, b) => b.jobRank - a.jobRank);

  return sortedJobs;
};

const matchingAlgoByFamily = (jobs, formatFamilies, favorite) => {
  const jobsliste = [];
  const pExpIntObject = formatToObject(formatFamilies);
  jobs.forEach((job) => {
    const newJob = {
      jobRank: sorteJobsByFamilyHigerRank(job, pExpIntObject),
      interested: getInterestedParam(favorite, job._id),
      ...job.toObject()
    };
    jobsliste.push(newJob);
  });

  const sortedJobs = jobsliste.sort((a, b) => b.jobRank - a.jobRank);
  return sortedJobs;
};
const matchingAlgoCombined = (jobs, parcour, formatFamilies, favorite) => {
  const matchInterest = matchingAlgoByInterest(jobs, parcour, favorite);
  const matchFamily = matchingAlgoByFamily(jobs, formatFamilies, favorite);
  const combined = matchInterest.concat(matchFamily);
  const reducedJobj = reduceJobs(combined, '_id');
  const sortedJobs = reducedJobj.sort((a, b) => b.jobRank - a.jobRank);
  return sortedJobs;
};

const matchingAlgo = (jobs, parcour, formatFamilies, favorite, algoType) => {
  if (algoType === Job.ALGO_TYPE[0]) {
    /* algoType is of interst' */
    return matchingAlgoByInterest(jobs, parcour, favorite);
  } else if (algoType === Job.ALGO_TYPE[1]) {
    /* algoType is of family' */
    return matchingAlgoByFamily(jobs, formatFamilies, favorite);
  }
  /* algoType is of interest_family' */
  return matchingAlgoCombined(jobs, parcour, formatFamilies, favorite);
};

exports.matchingAlgo = matchingAlgo;
