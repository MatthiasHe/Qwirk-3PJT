'use strict';
// @flow
require('ng-notify');

interface User {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default class SettingsController {
  user: User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  ngNotify;
  confirmPassword;
  passwordsNotMatch;
  errors = {other: undefined};
  message = '';
  submitted = false;
  Auth;
  $http;
  currentUser;
  upload;
  birthDate;
  file;
  bio;
  connectionport;

  /*@ngInject*/
  constructor(Auth, $http, Upload, ngNotify) {
    this.Auth = Auth;
    this.$http = $http;
    this.upload = Upload;
    this.ngNotify = ngNotify;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.file = this.currentUser.avatar;
      this.birthDate = this.currentUser.birthdate;
      this.bio = this.currentUser.bio;
    });
  }

  $onChanges() {
    const photo = <HTMLInputElement>document.getElementById('photo');
    this.file = photo.files[0];
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid && this.confirmPassword === this.user.newPassword) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.ngNotify.set('Password changed !', 'success');
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    } else {
      this.passwordsNotMatch = true;
    }
  }

  sendAvatar() {
    let filename;
    const path = 'http://localhost:3000/assets/avatar/';
    this.upload.upload({
      url: `api/users/sendavatarfile`,
      data: {file: this.file},
      method: 'POST'
    }).then(response => {
      filename = response.data;
      this.$http.post(`api/users/${this.currentUser._id}/sendavatar`, {avatarPath: path + filename});
    });
  }

  editProfile() {
    this.$http.post(`/api/users/${this.currentUser._id}/editprofile`, {
      bio: this.bio,
      birthDate: this.birthDate,
      connectionport: this.connectionport
    }).then(response => {
      this.ngNotify.set('Changes saved !', 'success');
    });
    this.sendAvatar();
  }

  //
  // prepareThumbmail() {
  //   const photo = <HTMLInputElement>document.getElementById('photo');
  //   this.file = photo.files[0];
  // }
}
