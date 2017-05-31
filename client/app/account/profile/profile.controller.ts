'use strict';
// @flow
const angular = require('angular');

export default class ProfileCtrl {
  user;
  userId;
  displayName;
  $http;

  /*@ngInject*/
  constructor($http, $stateParams) {
    this.$http = $http;
    this.userId = $stateParams.userId;
  }

  $onInit() {
    this.$http.get(`api/users/${this.userId}`).then(response => {
      this.user = response.data;
      if (this.user.nickname) {
        this.displayName = this.user.nickname;
      } else {
        this.displayName = this.user.name;
      }
    });
  }
}
