const { compact } = require('lodash');

exports.normalize = (args) => compact(args)
  .join(' ')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

