'use strict';

const logger = require('../utils/logger');

const bookmarkStore = require('../models/bookmark-store.js');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const viewData = {
      title: 'Bookmark Dashboard',
      bookmarks: bookmarkStore.getAllBookmarkLists(),
    };
    logger.info('about to render', bookmarkStore.getAllBookmarkLists());
    response.render('dashboard', viewData);
  },
};

module.exports = dashboard;
