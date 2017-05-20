'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('room', {
      url: '/room',
      template: require('./room.html'),
      controller: 'RoomController',
      controllerAs: 'roomCtrl'
    });
}
