'use strict';
const angular = require('angular');
require('ng-embed');
require('angular-file-upload');
const Upload = require('ng-file-upload');



import routes from './room.routes';
import RoomCtrl from './room.controller';

export default angular.module('projectTestApp.room', [
  'ui.router', 'ngEmbed', 'angularFileUpload', Upload])
  .config(routes)
  .controller('RoomCtrl', RoomCtrl)
  .name;
