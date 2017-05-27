'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routing from './account.routes';
import login from './login';
import settings from './settings';
import signup from './signup';
import friend from './friends';
import profile from './profile';


export default angular.module('projectTestApp.account', [
    uiRouter,
    login,
    settings,
    signup,
    friend,
    profile
])
    .config(routing)

    .run(function($rootScope) {
      'ngInject';
      $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
        if (next.name === 'logout' && current && current.name && !current.authenticate) {
          next.referrer = current.name;
        }
      });
    })
    .name;
