'use strict';
// @flow
const angular = require('angular');

class DashboardCtrl {

  private $http;
  private currentUser;
  private friendsRequest;

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.friendsRequest = this.currentUser.request;
    });
  }
}

export default angular.module('projectTestApp.dashboardDirective', [])
  .component('dashboardDirective', {
      template: require('./dashboardDirective.html'),
      restrict: 'E',
      controller: DashboardCtrl,
      controllerAs: 'dashboardCtrl',
      // bindings: {
      //   userid: '@'
      // }
  })
  .name;
