'use strict';
const angular = require('angular');
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');
require('ng-embed');
require('ng-file-upload');

import 'angular-socket-io';


const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');


import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import roomDirective from '../components/roomDirective/roomDirective/roomComponent.component';
import dashboardDirect from '../components/dashboardDirective/dashboardDirective/dashboardComponent.component';
import profileDirective from '../components/profileDirective/profileDirective/profileComponent.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';


import './app.scss';

angular.module('qwirkApp', [
  ngCookies,
  ngResource,
  ngSanitize,
  'ngEmbed',
  'ngFileUpload',

  'btford.socket-io',

  uiRouter,
  uiBootstrap,

  _Auth,
  account,
  main,
  constants,
  socket,
  util,
  roomDirective,
  profileDirective,
  dashboardDirect
])
  .config(routeConfig)
  .run(function ($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedIn(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['qwirkApp'], {
      strictDi: true
    });
  });
