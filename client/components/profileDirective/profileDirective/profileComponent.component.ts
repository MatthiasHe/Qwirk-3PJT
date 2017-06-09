'use strict';
// @flow
const angular = require('angular');

class ProfileCtrl {
  user;
  currentUser;
  userId;
  userid;
  displayName = '';
  surnameEditOn;
  friendId;
  $http;
  displayProfile;

  /*@ngInject*/
  constructor($http, $stateParams) {
    this.$http = $http;
    this.userId = $stateParams.userId;
    this.displayProfile = true;
  }

  $onChanges(changes) {
    this.onInitCalls(changes.userid.currentValue);
  };

  $onInit() {
    this.userId = this.userid;
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.currentUser.friends.forEach(friend => {
        if (friend.user._id === this.userId) {
          this.friendId = friend._id;
          if (friend.nickname) {
            this.displayName = friend.nickname;
          }
        }
      });
    });
    this.$http.get(`api/users/${this.userId}`).then(newResponse => {
      this.user = newResponse.data;
      if (this.displayName === undefined) {
        this.displayName = this.user.name;
      }
    });
  }

  editSurname() {
    this.surnameEditOn = true;
    // this.displayName = this.
  }

  sendSurnameForEdit() {
    this.surnameEditOn = false;
    this.$http.post(`api/users/${this.currentUser._id}/editsurname`, {friendId: this.friendId, newSurname: this.displayName});
  }

  onInitCalls(userid) {
    this.userId = userid;
    this.userId = this.userid;
    this.displayName = '';
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.currentUser.friends.forEach(friend => {
        if (friend.user._id === this.userId) {
          this.friendId = friend._id;
          if (friend.nickname) {
            this.displayName = friend.nickname;
          }
        }
      });
    });
    this.$http.get(`api/users/${this.userId}`).then(newResponse => {
      this.user = newResponse.data;
      if (this.displayName === '') {
        this.displayName = this.user.name;
      }
    });
  }
}


export default angular.module('qwirkApp.profileDirective', [])
  .component('profileDirective', {
      template: require('./profileDirective.html'),
      restrict: 'E',
      controller: ProfileCtrl,
      controllerAs: 'profileCtrl',
      bindings: {
        userid: '@'
      }
  })
  .name;
