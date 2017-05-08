'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('chat', {
      url: '/chat',
      template: require('./chat.html'),
      controller: 'ChatController',
      controllerAs: 'chatCtrl'
    });
}
