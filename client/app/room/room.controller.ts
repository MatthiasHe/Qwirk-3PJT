'use strict';

export default class RoomCtrl {
  message: string;
  socket;
  $http;
  messages;
  currentUser;
  roomId;
  room;

  /*@ngInject*/
  constructor(socket, $http, $stateParams) {
    this.message = '';
    this.socket = socket;
    this.$http = $http;
    this.roomId = $stateParams.roomId;
  }


  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
    });
    this.$http.get(`api/rooms/${this.roomId}`).then( response => {
      this.room = response.data;
      this.$http.get(`api/rooms/${this.roomId}/getmessages`, {roomId: this.room._id}).then(messages => {
        this.messages = messages.data;
      });
    });
  }

  $onDestroy() {
    this.socket.unsyncUpdates('Message');
  }

  sendMessage() {
    this.$http.post('/api/rooms/createmessage', {text: this.message, author: this.currentUser._id, roomId: this.roomId});
    this.message = '';
  }
}
