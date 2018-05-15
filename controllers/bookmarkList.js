'use strict';

const bookmarkStore = require('../models/bookmark-store');
const accounts = require('./accounts.js');
const uuid = require('uuid');
const cloudinary = require('cloudinary');
const path = require('path');
const logger = require('../utils/logger');

try {
  const env = require('../.env.json');
  cloudinary.config(env.cloudinary);
}
catch(e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const bookmarkList = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    const bookmarkListId = request.params.id;
    logger.debug('Bookmark List ID = ', bookmarkListId);
    if (loggedInUser) {
    const viewData = {
      title: 'Bookmarks',
      bookmarkList: bookmarkStore.getBookmarkList(bookmarkListId),
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    response.render('bookmarkList', viewData);
    }
    else response.redirect('/');
  },
  
  addLink(request, response) {
    const bookmarkListId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    const bookmarkList = bookmarkStore.getBookmarkList(bookmarkListId);
    const imageFile = request.files.picture;
    const linkId = uuid();
    const baseUrl = 'https://res.cloudinary.com/dylangore/image/upload/';
    const imgTransform = 'h_200,w_350,c_fill';
    
    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          const newLink = {
            id: linkId,
            title: request.body.title,
            link: request.body.link,
            summary: request.body.summary,
            img_base: result.secure_url,
            img_crop: baseUrl + imgTransform + '/' + result.public_id + '.' + result.format
          };
          logger.info('Adding link');
          bookmarkStore.addLink(bookmarkListId, newLink);
          response.redirect('/bookmarks/' + bookmarkListId);
        });
      }
    });
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