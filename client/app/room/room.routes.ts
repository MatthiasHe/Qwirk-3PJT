'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('room', {
      url: '/room/:roomId',
      template: require('./room.html'),
      controller: 'RoomCtrl',
      controllerAs: 'roomCtrl'
    });
}
