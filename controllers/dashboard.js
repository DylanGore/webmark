'use strict';

const logger = require('../utils/logger');
const accounts = require ('./accounts.js');
const bookmarkStore = require('../models/bookmark-store.js');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    
    const userId = loggedInUser.id;
    
    if (loggedInUser) {
    const viewData = {
      title: 'Bookmarks Dashboard',
      bookmarks: bookmarkStore.getUserBookmarks(userId),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      statUserTotalLists: bookmarkStore.getUserBookmarks(userId).length,
      statUserTotalLinks: bookmarkStore.getStatUserTotal(userId),
      statUserListMost: bookmarkStore.getStatUserListMost(userId),
      statUserListLeast: bookmarkStore.getStatUserListLeast(userId),
      statUserAvgLinks: bookmarkStore.getStatUserAvg(userId),
      statGlobalTotalLinks: bookmarkStore.getStatGlobalTotalBookmarks(),
      statGlobalAvgBookmarksPerUser: bookmarkStore.getStatGlobalAvgBookmarksPerUser(),
      statGlobalUserWithMost: bookmarkStore.getStatGlobalUserWithMost(),
      statGlobalUserWithLeast: bookmarkStore.getStatGlobalUserWithLeast(),
    };
    logger.info('about to render', bookmarkStore.getAllBookmarkLists());
    response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },

  addBookmarkList(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newBookmarkList = {
      id: uuid(),
      userid: loggedInUser.id,
      title: request.body.listname,
      links: [],
    };
    logger.debug('Creating a new Bookmark List', newBookmarkList);
    bookmarkStore.addBookmarkList(newBookmarkList);
    response.redirect('/dashboard');
  },
  
  deleteBookmarkList(request, response) {
    const bookmarkListId = request.params.id;
    bookmarkStore.removeBookmarkList(bookmarkListId);
    response.redirect('/dashboard');
  },
};

module.exports = dashboard;
