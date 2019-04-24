const FamilyRank = require('../models/familiesRank.model');

exports.update = async (req, res, next) => {
  const { familiesRank } = req.body;

  try {
    await FamilyRank.deleteMany({});
    const newFamily = await FamilyRank.insertMany(familiesRank);
    const transformedFamilies = newFamily.map((family) => family.transform());
    res.json(transformedFamilies);
  } catch (error) {
    next(error);
  }
};
/**
 * List interest
 * @public
 */

exports.list = async (req, res, next) => {
  try {
    const familiesRank = await FamilyRank.list(req.query);
    const transformedFamilies = familiesRank.map((rank) => rank.transform());

    res.json(transformedFamilies);
  } catch (error) {
    next(error);
  }
};
