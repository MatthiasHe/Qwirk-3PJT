'use strict';
const angular = require('angular');
require('ng-embed');
const Upload = require('ng-file-upload');



import routes from './room.routes';
import RoomCtrl from './room.controller';

export default angular.module('projectTestApp.room', [
  'ui.router', 'ngEmbed', Upload])
  .config(routes)
  .controller('RoomCtrl', RoomCtrl)
  .name;
