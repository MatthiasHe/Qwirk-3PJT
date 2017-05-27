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
  friends;

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
      this.friends = this.currentUser.friends;
      this.$http.get(`api/rooms/${this.roomId}`).then( newresponse => {
        this.room = newresponse.data;
        // this.users = this.room.members;
        this.$http.get(`api/rooms/${this.roomId}/getmessages`, { roomId: this.room._id }).then(room => {
          this.messages = room.data.messages;
          this.socket.syncUpdates('message', this.messages);
        });
        this.$http.get(`api/rooms/${this.roomId}/getparticipants`, { roomId: this.room._id} ).then(room => {
          this.users = room.data.members;
          // TO DO
/*          this.friends.forEach(function (friend, index) {
            room.data.members.forEach(user => {
              if (friend._id === user._id) {
                this.friends.splice(index, 1);
              }
            });
          });*/
        });
      });
    });
  }

  $onDestroy() {
    this.socket.unsyncUpdates('message');
  }

  sendMessage() {
    this.$http.post('/api/rooms/createmessage', { text: this.message, author: this.currentUser._id, roomId: this.roomId });
    this.message = '';
  }

  addMember(friendId, index) {
    this.$http.post(`api/rooms/${this.room._id}/addmember`, { newMemberId: friendId});
    this.users.push(this.friends[index]);
    this.friends.splice(index, 1);
  }
}
