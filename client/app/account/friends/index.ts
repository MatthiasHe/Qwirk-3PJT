'use strict';
const angular = require('angular');
import FriendCtrl from './friend.controller';

export default angular.module('projectTestApp.friendCtrl', [])
    .controller('FriendCtrl', FriendCtrl)
    .name;
