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
  currentUser;
  userRooms = [];
  userPrivateRooms = [];
  publicRooms = [];
  $state;
  roomId = '5931e815ac69ee3520fff353';
  displayDashboard;
  displayRoom;
  userState;

  /*@ngInject*/
  constructor($http, socket, Auth, $state) {
    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.$state = $state;
  }

  $onInit() {
    this.displayDashboard = true;
    this.displayRoom = false;
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
      this.userState = this.currentUser.state;
      this.friends = this.currentUser.friends;
      this.friendsRequest = this.currentUser.request;
      this.awaitingRequest = this.currentUser.awaitingRequest;
      this.$http.post('/api/rooms/userrooms').then(rooms => {
        rooms.data.forEach( room => {
          if (room.members.includes(this.currentUser._id)) {
            this.userRooms.push(room);
          } else {
            this.publicRooms.push(room);
          }
        });
        // this.socket.syncUpdates('room', this.rooms);userprivaterooms
      });
      this.$http.post('/api/rooms/userprivaterooms').then(rooms => {
        rooms.data.forEach( room => {
          if (room.members.includes(this.currentUser._id)) {
            this.userPrivateRooms.push(room);
          }
        });
        // this.socket.syncUpdates('room', this.rooms);
      });
      var self = this;
      this.socket.syncFriends('user', this.friends, function(event, item, array){
        var isBad = false;
        item.forEach(friend => {
          if (friend.user._id === self.currentUser._id) {
            isBad = true;
          }
        });
        if (!isBad) {
          self.friends = item;
        }
      });
      // var self = this;
      // this.socket.syncRequest('user', this.friends, function(event, item, array){
      //   self.friendsRequest = item;
      // });
      // this.socket.syncFriends('user', this.friends, function(event, item, array){
      //   self.friends = item;
      //   console.log('Hello');
      //   console.log(item);
      // });
      // this.socket.syncAwaitingRequest('user', this.friends, function(event, item, array){
      //   self.friends = item;
      // });
    });
  }

  $onDestroy() {
    this.socket.unsyncUpdates('user');
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
    this.$http.post(`api/users/${this.currentUser._id}/deletefriend`, { friendId: friendid });
  }

  setUserState(state) {
    this.$http.post(`api/users/${this.currentUser._id}/setstate`, { state: state });
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
