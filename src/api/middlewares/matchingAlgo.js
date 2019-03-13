const { flatten } = require('lodash');

const addJpInts = (interests) => {
  return [];
};

const addJpComps = (copmetences) => {
  return [];
};

/**
 * matching jobs with user parcour
 * @public
 */
const matchingAlgo = async (jobs, parcour) => {
  const { globalInterest, globalCopmetences } = parcour;
  // console.log('globalInterest', globalInterest);
  // console.log('globalCopmetences', globalCopmetences);
  // console.log('jobs', jobs);

  const JpInts = addJpInts(globalInterest);
  const JpComps = addJpComps(globalCopmetences);
};

exports.matchingAlgo = matchingAlgo;
