'use strict';
const angular = require('angular');
import ProfileCtrl from './profile.controller';

export default angular.module('projectTestApp.profileCtrl', [])
    .controller('ProfileCtrl', ProfileCtrl)
    .name;
