'use strict';
const angular = require('angular');
const Upload = require('ng-file-upload');
import SignupController from './signup.controller';

export default angular.module('qwirkApp.signup', [Upload])
    .controller('SignupController', SignupController)
    .name;
