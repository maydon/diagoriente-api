const { normalize } = require('./Normalize');

exports.importFormater = (objectArray, interestsList) => {
  //console.log(interestsList);
  objectArray.shift();

  const defineObj = (props) => {
    [title, activity, ...rest] = props;
    const interestsRank = [...rest].filter((x) => x);
    const interestsObj = interestsRank.map((x) => interestsList[x]);
    const interests = interestsObj.filter((x) => x);

    return {
      title,
      description: `Thème ${title}`,
      verified: true,
      type: 'professional',
      search: normalize([title]),
      activity: [
        {
          title: activity,
          type: 'professional',
          verified: true,
          interests,
          search: normalize([activity])
        }
      ]
    };
  };

  const reduced = objectArray.reduce((acc, obj) => {
    const obj2 = defineObj(obj.split(';'));
    const key = obj2.title;

    if (obj2.title) {
      const obj3 = { ...obj2, activity: [] };
      acc[key] = obj3;
    }

    const last = Object.keys(acc)[Object.keys(acc).length - 1];
    const activiyAcc = acc[last].activity || [];
    acc[last].activity = [...activiyAcc, ...obj2.activity];

    return acc;
  }, {});

  return Object.values(reduced);
};
