const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';
  Auth;
  friends = [];
  roomName = '';
  currentUser;
  rooms = [];
  $state;

  /*@ngInject*/
  constructor($http, $scope, socket, Auth, $state) {
    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.$state = $state;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
    });
    this.$http.get('api/rooms').then(response => {
      this.rooms = response.data;
      this.socket.syncUpdates('room', this.rooms);
    });

    this.Auth.getFriends().$promise
      .then(response => {
        this.friends = response;
        console.log(this.friends);
      });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }

  createRoom() {
    this.$http.post('/api/rooms', { name: this.roomName, adminId: this.currentUser._id, memberId: this.currentUser._id });
    this.roomName = '';
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
