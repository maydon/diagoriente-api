const { compact } = require('lodash');

exports.normalize = (args) => {
  return compact(args)
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
