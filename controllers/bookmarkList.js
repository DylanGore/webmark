'use strict';

const logger = require('../utils/logger');
const bookmarkStore = require('../models/bookmark-store');

const bookmarkList = {
  index(request, response) {
    const bookmarkId = request.params.id;
    logger.debug('Bookmark id = ', bookmarkId);
    const viewData = {
      title: 'Bookmarks',
      bookmarks: bookmarkStore.getBookmarkList(bookmarkId),
    };
    response.render('bookmarkList', viewData);
  },
  
  deleteLink(request, response) {
    const bookmarkListId = request.params.id;
    const linkId = request.params.linkid;
    logger.debug(`Deleting Link ${linkId} from Bookmark List ${bookmarkListId}`);
    bookmarkStore.removeLink(bookmarkListId, linkId);
    response.redirect('/bookmarks/' + bookmarkListId);
  },
};

module.exports = bookmarkList;