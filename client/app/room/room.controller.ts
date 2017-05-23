'use strict';

export default class RoomCtrl {
  message: string;
  socket;
  $http;
  messages;
  currentUser;

  /*@ngInject*/
  constructor(socket, $http) {
    this.message = '';
    this.socket = socket;
    this.$http = $http;
  }


  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
    });
    this.$http.get('api/rooms/getmessages').then(response => {
      this.messages = response.data;
      this.socket.syncUpdates('Message', this.messages);
    });
  }

  $onDestroy() {
    this.socket.unsyncUpdates('Message');
  }

  sendMessage() {
    this.$http.post('/api/rooms/createmessage', {text: this.message, author: this.currentUser._id});
    this.message = '';
  }
}
