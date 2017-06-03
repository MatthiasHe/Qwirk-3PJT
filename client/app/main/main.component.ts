const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  Auth;
  friends;
  friendsRequest;
  awaitingRequest;
  roomName = '';
  currentUser;
  userRooms = [];
  publicRooms = [];
  $state;
  roomId = '5931e815ac69ee3520fff353';

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
      // this.socket.syncUpdates('user', this.currentUser.request, function(event, item, array){
      //   array.forEach(function (request, index) {
      //     item.friends.forEach(friend){
      //       if (friend === request) {
      //         array.splice(index, 1);
      //       }
      //     };
      //   }
      //   this.$http.post(`api/users/${this.currentUser._id}/removerequest`, { friendId : friendId});
      //   console.log(event);
      //   console.log(item);
      //   console.log(array);
      this.friends = this.currentUser.friends;
      this.friendsRequest = this.currentUser.request;
      this.awaitingRequest = this.currentUser.awaitingRequest;
      this.$http.post('/api/rooms/userrooms', { userId : this.currentUser._id }).then(rooms => {
        rooms.data.forEach( room => {
          if (room.members.includes(this.currentUser._id)) {
            this.userRooms.push(room);
          } else {
            this.publicRooms.push(room);
          }
        });
        // this.socket.syncUpdates('room', this.rooms);
      });
      var self = this;
      this.socket.syncRequest('user', this.currentUser, function(event, item, array){
        self.friendsRequest = item;
      });
      this.socket.syncFriends('user', this.currentUser, function(event, item, array){
        self.friends = item;
      });
      this.socket.syncAwaitingRequest('user', this.currentUser, function(event, item, array){
        self.friends = item;
      });
    });
  }

  $onDestroy() {
    this.socket.unsyncUpdates('user');
  }

  createRoom() {
    this.$http.post('/api/rooms', { name: this.roomName, adminId: this.currentUser._id, memberId: this.currentUser._id, private: false  });
    this.roomName = '';
  }

  acceptRequest(friendId) {
    var roomId;
    this.$http.post('/api/rooms', { name: this.roomName, adminId: this.currentUser._id, memberId: this.currentUser._id, friendId: friendId, private: true }).then(room => {
      roomId = room.data._id;
      this.$http.post(`api/users/${this.currentUser._id}/addfriend`, { friendId : friendId, roomId: roomId});
    });
  }

  setRoomId(roomId) {
    this.roomId = roomId;
    // this.roomId.apply();
    // this.$state.reload();
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
