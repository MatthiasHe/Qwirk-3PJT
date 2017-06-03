'use strict';
// @flow
const angular = require('angular');

export default class DashboardCtrl {

  private $http;
  private currentUser;

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
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
