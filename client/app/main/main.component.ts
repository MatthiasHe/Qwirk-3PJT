const angular = require('angular');
const uiRouter = require('angular-ui-router');
require('ng-notify');
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  Auth;
  friends;
  friendsRequest;
  awaitingRequest;
  currentUser;
  userRooms = [];
  userPrivateRooms = [];
  publicRooms = [];
  $state;
  roomId;
  displayDashboard;
  displayRoom;
  userState;
  ngNotify;
  display;

  /*@ngInject*/
  constructor($http, socket, Auth, $state, ngNotify) {
    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.$state = $state;
    this.ngNotify = ngNotify;
  }

  $onInit() {
    this.display = 'friends';
    this.displayDashboard = true;
    this.displayRoom = false;
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      if (this.currentUser.state === 'Offline') {
        this.$http.post(`api/users/${this.currentUser._id}/setstate`, {state: 'Online'});
      }
      this.userState = this.currentUser.state;
      this.friends = this.currentUser.friends;
      this.friendsRequest = this.currentUser.request;
      this.awaitingRequest = this.currentUser.awaitingRequest;
      this.$http.post('/api/rooms/userrooms').then(rooms => {
        rooms.data.forEach(room => {
          if (room.members.includes(this.currentUser._id)) {
            this.userRooms.push(room);
          } else {
            this.publicRooms.push(room);
          }
        });
      });
      this.$http.post('/api/rooms/userprivaterooms').then(rooms => {
        rooms.data.forEach(room => {
          if (room.members.includes(this.currentUser._id)) {
            this.userPrivateRooms.push(room);
          }
        });
      });
      var self = this;
      this.socket.syncFriends('user', this.friends, function (event, item, array) {
        if (item._id === self.currentUser._id) {
          self.friends = item.friends;
          self.userState = item.state;
        } else {
          self.$http.get('api/users/me').then(response => {
            self.friends = response.data.friends;
          });
        }
      });
      this.socket.syncRooms('room', this.userRooms, function (event, item, array) {
        self.userRooms = [];
        self.userPrivateRooms = [];
        self.publicRooms = [];
        self.$http.post('/api/rooms/userrooms').then(rooms => {
          rooms.data.forEach(room => {
            if (room.members.includes(self.currentUser._id)) {
              self.userRooms.push(room);
            } else {
              self.publicRooms.push(room);
            }
          });
        });
        self.$http.post('/api/rooms/userprivaterooms').then(rooms => {
          rooms.data.forEach(room => {
            if (room.members.includes(self.currentUser._id)) {
              self.userPrivateRooms.push(room);
            }
          });
        });
      });
    });
  }

  $onDestroy() {
  }

  setRoomId(roomId) {
    this.roomId = roomId;
    this.displayDashboard = false;
    this.displayRoom = true;
  }

  displayTheDashboard() {
    this.displayDashboard = true;
    this.displayRoom = false;
  }

  deleteFriend(friendid) {
    this.$http.post(`api/users/${this.currentUser._id}/deletefriend`, {friendId: friendid});
  }

  setUserState(state) {
    this.$http.post(`api/users/${this.currentUser._id}/setstate`, {state: state});
  }

  displayFriends() {
    this.display = 'friends';
    this.removeActiveClass();
    angular.element( document.querySelector('#friends-tab')).addClass('active');
  }

  displayPrivateRooms() {
    this.display = 'privateRooms';
    this.removeActiveClass();
    angular.element( document.querySelector('#private-tab')).addClass('active');
  }

  displayUserPublicRooms() {
    this.display = 'publicUserRooms';
    this.removeActiveClass();
    angular.element( document.querySelector('#user-public-tab')).addClass('active');
  }

  displayPublicRooms() {
    this.display = 'publicRooms';
    this.removeActiveClass();
    angular.element( document.querySelector('#public-tab')).addClass('active');
  }

  removeActiveClass() {
    angular.element( document.querySelector('#friends-tab')).removeClass('active');
    angular.element( document.querySelector('#private-tab')).removeClass('active');
    angular.element( document.querySelector('#user-public-tab')).removeClass('active');
    angular.element( document.querySelector('#public-tab')).removeClass('active');
  }
}
export default angular.module('projectTestApp.main', [
  uiRouter, 'ngNotify'])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: 'mainCtrl'
  })
  .name;
