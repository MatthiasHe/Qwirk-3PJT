'use strict';
const angular = require('angular');
const Upload = require('ng-file-upload');
import SettingsController from './settings.controller';

export default angular.module('projectTestApp.settings', [Upload])
  .controller('SettingsController', SettingsController)
  .name;
