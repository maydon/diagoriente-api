exports.reduceId = (objectArray, property) => {
  const reduced = objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = { count: 0 };
    }
    acc[key] = { count: acc[key].count + 1, title: obj.nom, _id: obj._id };
    return acc;
  }, {});

  return Object.values(reduced);
};

exports.reduceCompetences = (objectArray, property) => {
  const reduced = objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = { value: 0 };
    }
    acc[key] = { value: acc[key].value + 1, _id: obj._id };
    return acc;
  }, {});

  return Object.values(reduced);
};

exports.reduceJobs = (objectArray, property) => {
  const reduced = objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = obj;
    } else {
      const jobRank = acc[key].jobRank + obj.jobRank;
      acc[key] = { ...obj, jobRank };
    }
    return acc;
  }, {});

  return Object.values(reduced);
};
