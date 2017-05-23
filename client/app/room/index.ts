'use strict';
const angular = require('angular');
import routes from './room.routes';
import RoomController from './room.controller';

export default angular.module('projectTestApp.room', [
  'ui.router', 'pubnub.angular.service'
])
  .config(routes)
  .controller('RoomController', RoomController)
  .name;
