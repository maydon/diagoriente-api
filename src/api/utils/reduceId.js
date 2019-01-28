exports.reduceId = (objectArray, property) => {
  const reduced = objectArray.reduce(function(acc, obj) {
    let count = 0;
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = { count: 0 };
    }
    acc[key] = { count: acc[key].count + 1, title: obj.nom, _id: obj._id };
    return acc;
  }, {});

  return Object.values(reduced);
};
