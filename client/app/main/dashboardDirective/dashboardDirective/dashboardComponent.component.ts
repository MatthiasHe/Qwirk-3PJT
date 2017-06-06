'use strict';
// @flow
const angular = require('angular');

class DashboardCtrl {

  private $http;
  private currentUser;
  private friendsRequest;
  private roomPublicName;
  private roomPrivateName;
  private awaitingRequest;
  private nickname;
  private friends;
  private socket;
  private searchResult = [];

  /*@ngInject*/
  constructor($http, socket) {
    this.$http = $http;
    this.socket = socket;
  }

  $onInit() {
    this.roomPublicName = '';
    this.roomPrivateName = '';
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.friends = this.currentUser.friends;
      this.friendsRequest = this.currentUser.request;
      this.awaitingRequest = this.currentUser.awaitingRequest;
    });
    var self = this;
    this.socket.syncRequest('user', this.friendsRequest, function(event, item, array){
      var isBad = false;
      item.forEach(request => {
        if (request._id === self.currentUser._id) {
          isBad = true;
        }
      });
      if (!isBad) {
        self.friendsRequest = item;
      }
    });
    this.socket.syncAwaitingRequest('user', this.awaitingRequest, function(event, item, array){
      var isBad = false;
      item.forEach(awaiting => {
        if (awaiting._id === self.currentUser._id) {
          isBad = true;
        }
      });
      if (!isBad) {
        self.awaitingRequest = item;
      }
    });
  }

  createPublicRoom() {
    this.$http.post('/api/rooms', {
      name: this.roomPublicName,
      adminId: this.currentUser._id,
      memberId: this.currentUser._id,
      private: false
    });
    this.roomPublicName = '';
  }

  createPrivateRoom() {
    this.$http.post('/api/rooms', {
      name: this.roomPrivateName,
      memberId: this.currentUser._id,
      private: true,
      privateMulti: true
    });
    this.roomPrivateName = '';
  }

  acceptRequest(friendId) {
    var roomId;
    this.$http.post('/api/rooms', {
      name: '',
      adminId: this.currentUser._id,
      memberId: this.currentUser._id,
      friendId: friendId,
      private: true
    }).then(room => {
      roomId = room.data._id;
      this.$http.post(`api/users/${this.currentUser._id}/addfriend`, {friendId: friendId, roomId: roomId});
    });
  }

  rejectRequest(friendId) {
    this.$http.post(`api/users/${this.currentUser._id}/rejectrequest`, {friendId: friendId});
  }

  searchFriend() {
    var temporarySearchResult;
    var add = true;
    this.$http.post('api/users/searchfriend', {nickname: this.nickname}).then(response => {
      temporarySearchResult = response.data;
      temporarySearchResult.forEach(userSearch => {
        this.friends.forEach(friend => {
          if (friend._id === userSearch._id) {
            add = false;
          }
        });
        this.awaitingRequest.forEach(request => {
          if (request._id === userSearch._id) {
            add = false;
          }
        });
        if (add && this.currentUser._id !== userSearch._id) {
          this.searchResult.push(userSearch);
        } else {
          add = true;
        }
      });
    });
  }

  addFriend(userId) {
    var temporarySearchResult = this.searchResult;
    this.searchResult.forEach(function (user, index) {
      if (userId === user._id) {
        temporarySearchResult.splice(index, 1);
      }
    });
    this.searchResult = temporarySearchResult;
    this.$http.post(`api/users/${this.currentUser._id}/sendrequest`, {friendId: userId});
  }
}

export default angular.module('projectTestApp.dashboardDirective', [])
  .component('dashboardDirective', {
    template: require('./dashboardDirective.html'),
    restrict: 'E',
    controller: DashboardCtrl,
    controllerAs: 'dashboardCtrl',
    // bindings: {
    //   userid: '@'
    // }
  })
  .name;
