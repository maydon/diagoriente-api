const { mailer } = require('../middlewares/mailer');
/**
 * Get skills list
 * @public
 */
exports.mailer = async (req, res, next) => {
  try {
    const sendMail = await mailer(
      'benalaya.safouene@gmail.com b.brahim.seif@gmail.com'
    );
    res.json(sendMail);
  } catch (error) {
    next(error);
  }
};
