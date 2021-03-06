'use strict';
// @flow
const angular = require('angular');
require('ng-notify');

interface User {
  name: string;
  email: string;
  password: string;
}

export default class SignupController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {};
  confirmPassword;
  passwordsNotMatch = false;
  submitted = false;
  Auth;
  $state;
  upload;
  file;
  $http;

  /*@ngInject*/
  constructor(Auth, $state, Upload, $http, ngNotify) {
    this.Auth = Auth;
    this.$state = $state;
    this.upload = Upload;
    this.$http = $http;
  }

  $onInit() {
    this.file = '/../../assets/pictures/Default-avatar.jpg';
  }

  register(form) {
    this.submitted = true;

    if (form.$valid && this.confirmPassword === this.user.password) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
        .then((response) => {
          this.sendAvatar(response.user._id);
          // Account created, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });

        });
    } else {
      this.passwordsNotMatch = true;
    }
  }

  sendAvatar(userId) {
    let filename;
    const path = 'http://localhost:3000/assets/avatar/';
    this.upload.upload({
      url: `api/users/sendavatarfile`,
      data: {file: this.file},
      method: 'POST'
    }).then(response => {
      filename = response.data;
      this.$http.post(`api/users/${userId}/sendavatar`, {avatarPath: path + filename});
    });
  }

  prepareThumbmail() {
    const photo = <HTMLInputElement>document.getElementById('photo');
    // this.file = photo.files[0];
  }
}
