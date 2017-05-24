'use strict';

export default class RoomCtrl {
  message: string;
  socket;
  $http;
  messages;
  currentUser;
  roomId;
  room;
  users;

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
      this.users = this.room.members;
      this.$http.get(`api/rooms/${this.roomId}/getmessages`, {roomId: this.room._id}).then(room => {
        this.messages = room.data.messages;
        this.socket.syncUpdates('message', this.messages);
      });
      this.$http.get(`api/rooms/${this.roomId}/getparticipants`, {roomId: this.room._id}).then(participants => {
        this.users = participants.data.members;
      });
    });
  }

  $onDestroy() {
    this.socket.unsyncUpdates('message');
  }

  sendMessage() {
    this.$http.post('/api/rooms/createmessage', {text: this.message, author: this.currentUser._id, roomId: this.roomId});
    this.message = '';
  }
}
