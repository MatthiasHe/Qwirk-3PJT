'use strict';
const angular = require('angular');
import routes from './room.routes';
import RoomCtrl from './room.controller';

export default angular.module('projectTestApp.room', [
  'ui.router'
])
  .config(routes)
  .controller('RoomCtrl', RoomCtrl)
  .name;
