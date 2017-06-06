'use strict';
/* eslint no-sync: 0 */
const angular = require('angular');
require('ng-embed');
const Upload = require('ng-file-upload');

class RoomComponent {
  message: string;
  socket;
  $http;
  messages;
  currentUser;
  roomId;
  room;
  users;
  friends;
  options;
  file;
  upload;
  messageEdit;
  isPrivate;
  isParticipant;
  isAdmin;
  canManage;
  moderators;
  scope;
  roomid;
  profileDisplayId;
  displayProfile;
  displayParticpants;
  displayFriends;

  /*@ngInject*/
  constructor(socket, $http, Upload) {
    this.message = '';
    this.socket = socket;
    this.$http = $http;
    this.upload = Upload;
    // this.roomId = $scope.roomid;
    // this.scope = $scope;
    // this.scope.$watch('roomid', function (newValue, oldValue) {
    //   console.log($scope.);
      // $scope.$parent.onInitCalls(newValue);
      // this.onInitCalls(newValue);
    // }, true);
  }

  $onChanges(changes) {
    console.log(changes.roomid.currentValue);
    this.onInitCalls(changes.roomid.currentValue);
  };

  $onInit() {
    var temporalyFriendList = [];
    this.displayParticpants = true;
    this.displayFriends = false;
    // this.$watch('roomid', function (newValue, oldValue) {
    //   }, true);
    this.roomId = this.roomid;
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.friends = this.currentUser.friends;
      this.friends.forEach(friend => {
        if (friend.nickname === undefined) {
          friend.nickname = friend.user.name;
        }
      });
      this.$http.get(`api/rooms/${this.roomId}`).then( newresponse => {
        this.room = newresponse.data;
        this.moderators = this.room.moderators;
        if (this.room.private || this.room.privateMulti) {
          this.isPrivate = true;
        }
        if (this.room.admin === this.currentUser._id) {
          this.isAdmin = true;
        }
        if (this.room.moderators.includes(this.currentUser._id)) {
          this.canManage = true;
        }
        this.$http.get(`api/rooms/${this.roomId}/getmessages`, { roomId: this.room._id }).then(room => {
          this.messages = room.data.messages;
          this.socket.syncUpdates('message', this.messages);
        });
        this.$http.get(`api/rooms/${this.roomId}/getparticipants`, { roomId: this.room._id} ).then(room => {
          this.users = room.data.members;
          this.friends.forEach(function(friend, index) {
            if (!this.users.includes(friend._id)) {
              temporalyFriendList.push(friend);
            }
          });
          this.friends = temporalyFriendList;
          this.users.forEach( user => {
            if (user._id === this.currentUser._id) {
              this.isParticipant = true;
            }
          });
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
    this.initEmbedOptions();
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
    // this.users.push(this.friends[index]);
    this.friends.splice(index, 1);
  }

  sendFile() {
    let filename;
    const path = 'http://localhost:3000/assets/files/';
    this.upload.upload({
      url: `api/rooms/sendfile`,
      data: {file: this.file},
      method: 'POST'
    }).then(response => {
      filename = response.data;
      this.$http.post('/api/rooms/createmessage', { text: path + filename, author: this.currentUser._id, roomId: this.roomId });
      this.message = '';
    });
  }

  joinRoom() {
    this.$http.post(`api/rooms/${this.room._id}/joinroom`, { userId: this.currentUser._id});
    this.isParticipant = true;
  }

  leaveRoom() {
    this.$http.post(`api/rooms/${this.room._id}/leaveroom`, { userId: this.currentUser._id});
    this.isParticipant = false;
  }

  giveModeratorRights(userId) {
    this.$http.post(`api/rooms/${this.room._id}/givemoderatorrights`, { newModeratorId: userId});
  }

  removeModeratorRights(userId) {
    this.$http.post(`api/rooms/${this.room._id}/removemoderatorrights`, { oldModeratorId: userId});
  }

  editMessage(message) {
    message.editOn = true;
    this.messageEdit = message.text;
  }

  sendTextForEdit(message) {
    this.$http.post(`api/rooms/${this.room._id}/editmessage`, {messageId: message._id, text: this.messageEdit});
    message.editOn = false;
    this.messageEdit = '';
  }

  displayAProfile(profileId) {
    this.displayProfile = true;
    this.profileDisplayId = profileId;
  }

  displayChat() {
    this.displayProfile = false;
  }

  displayMyFriends() {
    this.displayParticpants = false;
    angular.element( document.querySelector('#participants-nav')).removeClass('active');
    this.displayFriends = true;
    angular.element( document.querySelector('#friends-nav')).addClass('active');
  }

  displayTheParticipants() {
    this.displayParticpants = true;
    angular.element( document.querySelector('#participants-nav')).addClass('active');
    this.displayFriends = false;
    angular.element( document.querySelector('#friends-nav')).removeClass('active');
  }

  onInitCalls(roomid) {
    var temporalyFriendList = [];
    this.isParticipant = false;
    this.displayProfile = false;
    this.roomId = roomid;
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.friends = this.currentUser.friends;
      this.$http.get(`api/rooms/${this.roomId}`).then( newresponse => {
        this.room = newresponse.data;
        this.moderators = this.room.moderators;
        if (this.room.private) {
          this.isPrivate = true;
        }
        if (this.room.admin === this.currentUser._id) {
          this.isAdmin = true;
        }
        if (this.room.moderators.includes(this.currentUser._id)) {
          this.canManage = true;
        }
        this.$http.get(`api/rooms/${this.roomId}/getmessages`, { roomId: this.room._id }).then(room => {
          this.messages = room.data.messages;
          this.socket.syncUpdates('message', this.messages);
        });
        this.$http.get(`api/rooms/${this.roomId}/getparticipants`, { roomId: this.room._id} ).then(room => {
          this.users = room.data.members;
          var temporalyUsersList = [];
          this.users.forEach(user => {
            temporalyUsersList.push(user._id);
          });
          this.friends.forEach(function(friend, index) {
            if (!temporalyUsersList.includes(friend.user._id)) {
              temporalyFriendList.push(friend);
            }
          });
          this.friends = temporalyFriendList;
          this.users.forEach( user => {
            if (user._id === this.currentUser._id) {
              this.isParticipant = true;
            }
          });
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
    this.initEmbedOptions();
  }

  initEmbedOptions() {
    this.options = {
      watchEmbedData   : false,     // watch embed data and render on change

      sanitizeHtml     : false,      // convert html to text

      fontSmiley       : true,      // convert ascii smileys into font smileys
      emoji            : true,      // convert emojis short names into images

      link             : true,      // convert links into anchor tags
      linkTarget       : '_blank',   //_blank|_self|_parent|_top|framename

      pdf              : {
        embed: true                 // show pdf viewer.
      },

      image            : {
        embed: true                // toggle embedding image after link, supports gif|jpg|jpeg|tiff|png|svg|webp.
      },

      audio            : {
        embed: false                 // toggle embedding audio player, supports wav|mp3|ogg
      },

      basicVideo       : false,     // embed video player, supports ogv|webm|mp4
      gdevAuth         :'xxxxxxxx', // Google developer auth key for YouTube data api
      video            : {
        embed           : false,    // embed YouTube/Vimeo videos
        width           : null,     // width of embedded player
        height          : null,     // height of embedded player
        ytTheme         : 'dark',   // YouTube player theme (light/dark)
        details         : false,    // display video details (like title, description etc.)
        thumbnailQuality: 'medium', // quality of the thumbnail low|medium|high
        autoPlay        : false     // autoplay embedded videos
      },
      twitchtvEmbed    : false,
      dailymotionEmbed : false,
      tedEmbed         : false,
      dotsubEmbed      : false,
      liveleakEmbed    : false,
      ustreamEmbed    : false,

      soundCloudEmbed  : false,
      soundCloudOptions: {
        height      : 160,
        themeColor: 'f50000',
        autoPlay    : false,
        hideRelated : false,
        showComments: false,
        showUser    : false,
        showReposts : false,
        visual      : false,         // Show/hide the big preview image
        download    : false          // Show/Hide download buttons
      },
      spotifyEmbed     : false,

      tweetEmbed       : false,        // toggle embedding tweets
      tweetOptions     : {
        // The maximum width of a rendered Tweet in whole pixels. Must be between 220 and 550 inclusive.
        maxWidth  : 550,
        // Toggle expanding links in Tweets to photo, video, or link previews.
        hideMedia : false,
        // When set to false or 1 a collapsed version of the previous Tweet in a conversation thread
        // will not be displayed when the requested Tweet is in reply to another Tweet.
        hideThread: false,
        // Specifies whether the embedded Tweet should be floated left, right, or center in
        // the page relative to the parent element.Valid values are left, right, center, and none.
        // Defaults to none, meaning no alignment styles are specified for the Tweet.
        align     : 'none',
        // Request returned HTML and a rendered Tweet in the specified.
        // Supported Languages listed here (https://dev.twitter.com/web/overview/languages)
        lang      : 'en'
      },
      code             : {
        highlight  : false,        // highlight code written in 100+ languages supported by highlight
        // requires highlight.js (https://highlightjs.org/) as dependency.
        lineNumbers: false        // display line numbers
      },
      codepenEmbed     : false,
      codepenHeight    : 300,
      jsfiddleEmbed    : false,
      jsfiddleHeight   : 300,
      jsbinEmbed       : false,
      jsbinHeight      : 300,
      plunkerEmbed     : false,
      githubgistEmbed  : false,
      ideoneEmbed      : false,
      ideoneHeight     : 300
    };
  }

}

export default angular.module('projectTestApp.roomDirective', ['ui.router', 'ngEmbed', 'angularFileUpload', Upload])
  .component('roomDirective', {
      template: require('./roomDirective.html'),
      restrict: 'E',
      controller: RoomComponent,
      controllerAs: 'roomCtrl',
      bindings: {
        roomid: '@'
      }
  })
  .name;
