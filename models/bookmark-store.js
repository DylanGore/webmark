'use strict';

const _ = require('lodash');

const bookmarkStore = {

  bookmarkCollection: require('./bookmark-store.json').bookmarkCollection,
  
  getAllBookmarkLists() {
    return this.bookmarkCollection;
  },

  getBookmarkList(id) {
    return _.find(this.bookmarkCollection, { id: id });
  },
  
  removeLink(id, linkId) {
    const bookmarkList = this.getBookmarkList(id);
     _.remove(bookmarkList.links, { id: linkId });
  },
};

module.exports = bookmarkStore;