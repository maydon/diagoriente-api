const bcrypt = require('bcryptjs');
const { env } = require('../../config/vars');

exports.hashPassword = async (password) => {
  try {
    const rounds = env === 'test' ? 1 : 10;
    return await bcrypt.hash(password, rounds);
  } catch (e) {
    throw Error('bcrypt hash password error');
  }
};
