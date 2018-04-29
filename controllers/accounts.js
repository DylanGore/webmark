'use strict';
const userstore = require('../models/user-store.js');
const logger = require('../utils/logger.js');
const uuid = require('uuid');

const accounts = {
  
  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('bookmarklist', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    
    const formEmail = request.body.email
    const formPassword = request.body.password
    
    const userPassword = user.password
    
    if (user && formPassword === userPassword) {
      response.cookie('bookmarklist', user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      response.redirect('/login');
      logger.info(`login failed ${formEmail}`)
    }
  },

  getCurrentUser (request) {
    const userEmail = request.cookies.bookmarklist;
    return userstore.getUserByEmail(userEmail);
  }
}

module.exports = accounts;