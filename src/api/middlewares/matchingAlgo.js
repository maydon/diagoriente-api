const math = require('mathjs');

const addJpInts = (data) => {
  const formatDate = {
    globalCount: data.reduce((acc, val) => acc + val.count, 0),
    interests: data
  };

  const formatObjectDate = {};

  formatDate.interests.map((item) => {
    if (item.count > 0) {
      const f = math.fraction(item.count, formatDate.globalCount);
      item.jpInt = math.number(f);
    } else {
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

  formatDate.competences.map((item) => {
    if (item.count > 0) {
      const f = math.fraction(item.count, formatDate.globalCount);
      item.jpComp = math.number(f);
    } else {
      item.jpComp = 0;
    }
    formatObjectDate[item._id] = item;
  });

  return formatObjectDate;
};

const sorteJobsByHigerRank = (job, JpInts, JpComps) => {
  let jobRank = 0;

  job.interests.forEach((interest) => {
    if (interest._id in JpInts) {
      const m = math.multiply(JpInts[interest._id].jpInt, interest.weight);

      jobRank += math.number(m);
    }
  });

  job.competences.forEach((competence) => {
    if (competence._id in JpComps) {
      const m = math.multiply(
        JpComps[competence._id].jpComp,
        competence.weight
      );

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
      console.log(item.interested);
    }
  });
  return interestedParam;
};

/**
 * matching jobs with user parcour
 * @public
 */
const matchingAlgo = (jobs, parcour, favorite) => {
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

  const sortedJobs = jobsliste.sort((a, b) => {
    return b.jobRank - a.jobRank;
  });

  return sortedJobs;
};

exports.matchingAlgo = matchingAlgo;
