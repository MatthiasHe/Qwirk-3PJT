'use strict';
const angular = require('angular');
import routes from './chat.routes';
import ChatController from './chat.controller';

export default angular.module('projectTestApp.chat', [
  'ui.router'
])
  .config(routes)
  .controller('ChatController', ChatController)
  .name;
