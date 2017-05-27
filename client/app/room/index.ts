'use strict';
const angular = require('angular');
require('ng-embed');


import routes from './room.routes';
import RoomCtrl from './room.controller';

export default angular.module('projectTestApp.room', [
  'ui.router', 'ngEmbed'

])
  .config(routes)
  .controller('RoomCtrl', RoomCtrl)
  .name;
