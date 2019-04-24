const { mailer } = require('../middlewares/mailer');
/**
 * Get skills list
 * @public
 */
exports.mailer = async (req, res, next) => {
  try {
    const user = {
      email: 'safouene@gmail.com',
      _id: 'efakeid34343413mon44',
      profile: {
        lastName: 'Ba'
      }
    };
    const sendMail = await mailer(
      ['benalaya.safouene@gmail.com', 'b.brahim.seif@gmail.com'],
      user
    );
    res.json(sendMail);
  } catch (error) {
    next(error);
  }
};
