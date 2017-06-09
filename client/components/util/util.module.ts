'use strict';
const angular = require('angular');
import {UtilService} from './util.service';

export default angular.module('qwirkApp.util', [])
  .factory('Util', UtilService)
  .name;
