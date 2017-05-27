const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  Auth;
  friends = [];
  friendsRequest;
  awaitingRequest;
  roomName = '';
  currentUser;
  rooms = [];
  $state;

  /*@ngInject*/
  constructor($http, socket, Auth, $state) {
    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.$state = $state;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.friends = this.currentUser.friends;
      this.friendsRequest = this.currentUser.request;
      this.awaitingRequest = this.currentUser.awaitingRequest;
      this.$http.post('/api/rooms/userrooms', { userId : this.currentUser._id }).then(rooms => {
        this.rooms = rooms.data;
        this.socket.syncUpdates('room', this.rooms);
      });
    });
  }

  createRoom() {
    this.$http.post('/api/rooms', { name: this.roomName, adminId: this.currentUser._id, memberId: this.currentUser._id });
    this.roomName = '';
  }

  acceptRequest(friendId) {
    var roomId;
    this.$http.post('/api/rooms', { name: this.roomName, adminId: this.currentUser._id, memberId: this.currentUser._id, friendId: friendId, private: true }).then(room => {
      roomId = room.data._id;
      this.$http.post(`api/users/${this.currentUser._id}/addfriend`, { friendId : friendId, roomId: roomId});
    });
  }
  rejectRequest(friendId) {
    this.$http.post(`api/users/${this.currentUser._id}/rejectrequest`, { friendId : friendId});
  }
}

export default angular.module('projectTestApp.main', [
  uiRouter])
    .config(routing)
    .component('main', {
      template: require('./main.html'),
      controller: MainController
    })
    .name;
