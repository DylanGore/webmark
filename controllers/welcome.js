'use strict';

const logger = require('../utils/logger');

const welcome = {
  index(request, response) {
    logger.info('welcome rendering');
    const viewData = {
      title: 'Welcome',
    };
    response.render('welcome', viewData);
  },
};

module.exports = welcome;
