'use strict';
const angular = require('angular');
require('ng-embed');
require('angular-file-upload');


import routes from './room.routes';
import RoomCtrl from './room.controller';

export default angular.module('projectTestApp.room', [
  'ui.router', 'ngEmbed', 'angularFileUpload'

])
  .config(routes)
  .controller('RoomCtrl', RoomCtrl)
  .name;
