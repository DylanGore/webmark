'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts.js');
const bookmarkStore = require('../models/bookmark-store.js');

const welcome = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    logger.info('welcome rendering');
    if (loggedInUser) {
    const viewData = {
      title: 'Welcome ' + loggedInUser.firstName,
      loggedin: true,
      totalLinks: bookmarkStore.getStatGlobalTotalBookmarks(),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    response.render('welcome', viewData);
    }
    else {
      const viewData = {
        title: 'Home',
        loggedin: false,
        totalLinks: bookmarkStore.getStatGlobalTotalBookmarks(),
      };
      response.render('welcome', viewData);
    }
  },
};

module.exports = welcome;
