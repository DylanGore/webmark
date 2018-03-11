'use strict';

const express = require('express');
const router = express.Router();

const welcome = require('./controllers/welcome.js');
const dashboard = require('./controllers/dashboard.js');
const about = require('./controllers/about.js');
const bookmarkList = require('./controllers/bookmarkList.js');

router.get('/', welcome.index);
router.get('/dashboard', dashboard.index);
router.get('/about', about.index);
router.get('/bookmarks/:id', bookmarkList.index);
router.get('/bookmarks/:id/deletelink/:linkid', bookmarkList.deleteLink);

module.exports = router;
