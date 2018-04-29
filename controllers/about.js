'use strict';

const logger = require('../utils/logger');
const accounts = require ('./accounts.js');
const messageStore = require('../models/message-store.js')
const uuid = require('uuid')

const about = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request); 
    const messages = messageStore.getAllMessages();
    logger.info('about rendering');
    if (loggedInUser) {
    const viewData = {
      title: 'About',
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      messages: messages,
    };
    response.render('about', viewData);
   }
    else response.redirect('/');
  },
  
  addMessage(request, response) {
    const messageId = request.params.id;
    const message = messageStore.getMessage(messageId);
    const loggedInUser = accounts.getCurrentUser(request); 
    const newLink = {
      id: uuid(),
      message: request.body.message,
      user: loggedInUser.firstName + ' ' + loggedInUser.lastName,
    };
    messageStore.addMessage(newLink);
    response.redirect('/about');
  },
  
  deleteMessage(request, response) {
    const messageId = request.params.id;
    messageStore.removeMessage(messageId);
    response.redirect('/about');
  },
};

module.exports = about;
