'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store.js');
const userStore = require('./user-store.js');
const logger = require('../utils/logger');
const path = require('path');
const cloudinary = require('cloudinary');

try {
  const env = require('../.env.json');
  cloudinary.config(env.cloudinary);
}
catch(e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const bookmarkStore = {

  store: new JsonStore('./models/bookmark-store.json', { bookmarkCollection: [] }),
  collection: 'bookmarkCollection',
  
  getUserBookmarks(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },
  
  getAllBookmarkLists() {
    return this.store.findAll(this.collection);
  },

  getBookmarkList(id) {
    return this.store.findOneBy(this.collection, { id: id});
  },
  
  addBookmarkList(bookmarkList) {
    this.store.add(this.collection, bookmarkList);
  },
  
  removeBookmarkList(id) {
    const bookmarkList = this.getBookmarkList(id);
    this.store.remove(this.collection, bookmarkList);
  },

  removeAllBookmarkLists() {
    this.store.removeAll(this.collection);
  },

  addLink(id, link) {
    const bookmarkList = this.getBookmarkList(id);
    bookmarkList.links.push(link);
  },

  removeLink(id, linkId){
    const bookmarkList = this.getBookmarkList(id);
    const links = bookmarkList.links;

    for(let i = 0; i < links.length; i++){
      if(links[i].id === linkId){
        if(links[i].img != null){
          const image = path.parse(links[i].img_base);
          logger.debug('Delete Cloudinary Image - ' + links[i].img_base);
          cloudinary.api.delete_resources([image.name], function (result) {
            console.log(result);
          });
          _.remove(links, { id: linkId});
        }else{
          logger.debug("Removing link " + linkId + " without image");
          _.remove(links, { id: linkId});
        }
      }
    }
  },
  
  getStatGlobalTotalBookmarks() {
    const allBookmarks = this.getAllBookmarkLists();
    let totalLinks = 0;
    
    for(let i = 0; i < allBookmarks.length; i++){
      totalLinks = totalLinks + allBookmarks[i].links.length;
    }
    
    logger.info('Total links: ' + totalLinks)
    return totalLinks;
  },
  
  getStatGlobalAvgBookmarksPerUser(){
    const allUsers = userStore.getAllUsers();
    let numOfUsers = allUsers.length;
    let globalTotal = this.getStatGlobalTotalBookmarks();
    let avg = globalTotal/numOfUsers;
    if(globalTotal > 0 && numOfUsers > 0){
      return avg.toFixed(2);
    }else{
      return 0;
    }
  },
  
  getStatGlobalUserWithMost(){
    const allUsers = userStore.getAllUsers();
    let numOfLinks = 0;
    let username = "No Bookmarks";
    
    for(let i = 0; i < allUsers.length; i++){
      let currUser = userStore.getUserByEmail(allUsers[i].email);
      let currUserId = currUser.id;
      let currUserLinksNo = this.getStatUserTotal(currUserId);
      
      if(currUserLinksNo >= numOfLinks){
        numOfLinks = currUserLinksNo;
        username = currUser.firstName + " " + currUser.lastName;
      }
    }
    
    return username;
  },
  
  getStatGlobalUserWithLeast(){
    const allUsers = userStore.getAllUsers();
    let numOfLinks = this.getStatGlobalTotalBookmarks();
    
    let username = "No Bookmarks";
    
    for(let i = 0; i < allUsers.length; i++){
      let currUserId = allUsers[i].id;
      let currUser = userStore.getUserById(currUserId);
      let userListLength = this.getStatUserTotal(currUserId);
      if(numOfLinks >= userListLength){
        numOfLinks = userListLength;
        username = currUser.firstName + ' ' + currUser.lastName;
      }
    }
    
    logger.info('User with least links: ' + username)
    
    return username;
  },
  
  getStatUserAvg(userid) {
    const userBookmarks = this.getUserBookmarks(userid)
    const noOfLists = userBookmarks.length;
    let total = this.getStatUserTotal(userid);
    let avg = total/noOfLists;
    if(avg >= 0){
      return avg.toFixed(2);
    }else{
      return 0;
    }
  },
  
  getStatUserTotal(userid) {
    const userBookmarks = this.getUserBookmarks(userid)
    let total = 0;
    
    for(let i = 0; i < userBookmarks.length; i++){
      total = total + userBookmarks[i].links.length;
    }
    return total;
  },
  
  getStatUserListMost(userid) {
    const userBookmarks = this.getUserBookmarks(userid)
    let num = 0;
    let name = "No Bookamrks";
    
    for(let i = 0; i < userBookmarks.length; i++){
      let listLength = userBookmarks[i].links.length;
      if(num < listLength){
        num = listLength;
        name = userBookmarks[i].title;
      }
    }
    return name;
  },
  
  getStatUserListLeast(userid) {
    const userBookmarks = this.getUserBookmarks(userid)
    let num = this.getStatUserTotal(userid);
    let name = "No Bookmarks";
    
    for(let i = 0; i < userBookmarks.length; i++){
      let listLength = userBookmarks[i].links.length;
      if(num >= listLength){
        num = listLength;
        name = userBookmarks[i].title;
      }
    }
    return name;
  },
};

module.exports = bookmarkStore;