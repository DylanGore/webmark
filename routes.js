'use strict';

const express = require('express');
const router = express.Router();

const welcome = require('./controllers/welcome.js');
const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js');
const bookmarkList = require('./controllers/bookmarkList.js');
const accounts = require('./controllers/accounts.js');

router.get('/', welcome.index);
router.get('/dashboard', dashboard.index);
router.get('/about', about.index);
router.get('/bookmarks/:id', bookmarkList.index);
router.get('/bookmarks/:id/deletelink/:linkid', bookmarkList.deleteLink);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post('/about/addmessage', about.addMessage);
router.get('/about/deletemessage/:id/', about.deleteMessage);
router.post('/bookmarks/:id/addlink', bookmarkList.addLink);
router.post('/dashboard/addbookmarklist', dashboard.addBookmarkList);
router.get('/dashboard/deletebookmarklist/:id', dashboard.deleteBookmarkList);

module.exports = router;
