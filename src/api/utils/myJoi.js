const Joi = require('joi');
const fr = require('./locale_FR.json');

module.exports = Joi.defaults((schema) => schema.options({ language: fr }));
