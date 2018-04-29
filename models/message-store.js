'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store.js')

const messageStore = {

  store: new JsonStore('./models/message-store.json', { messageCollection: [] }),
  collection: 'messageCollection',
  
  getAllMessages() {
    return this.store.findAll(this.collection);
  },
  
  getMessage(id) {
    return this.store.findOneBy(this.collection, { id: id});
  },
  
  addMessage(msg) {
    this.store.add(this.collection, msg);
  },
  
  removeMessage(id) {
    const msg = this.getMessage(id);
    this.store.remove(this.collection, msg);
  },

  removeAllMessages() {
    this.store.removeAll(this.collection);
  },
};

module.exports = messageStore;