'use strict';
// @flow
const angular = require('angular');

export default class ProfileCtrl {
  user;
  currentUser;
  userId;
  displayName;
  surnameEditOn;
  friendId;
  $http;

  /*@ngInject*/
  constructor($http, $stateParams) {
    this.$http = $http;
    this.userId = $stateParams.userId;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.currentUser.friends.forEach(friend => {
        if (friend.user._id === this.userId) {
          this.friendId = friend._id;
          if (friend.nickname) {
            this.displayName = friend.nickname;
          }
        }
        this.$http.get(`api/users/${this.userId}`).then(newResponse => {
          this.user = newResponse.data;
          if (this.displayName === undefined) {
            this.displayName = this.user.name;
          }
        });
      });
    });
  }

  editSurname() {
    this.surnameEditOn = true;
    console.log(this.displayName);
    // this.displayName = this.
  }

  sendSurnameForEdit() {
    this.surnameEditOn = false;
    this.$http.post(`api/users/${this.currentUser._id}/editsurname`, {friendId: this.friendId, newSurname: this.displayName});
  }
}
