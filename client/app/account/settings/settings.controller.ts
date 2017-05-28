'use strict';
// @flow
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
  errors = {other: undefined};
  message = '';
  submitted = false;
  Auth;
  file;
  $http;
  currentUser;

  /*@ngInject*/
  constructor(Auth, $http) {
    this.Auth = Auth;
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
    });
  }

  $onChanges() {
    const photo = <HTMLInputElement>document.getElementById('photo');
    this.file = photo.files[0];
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }

  sendAvatar() {
    const photo = <HTMLInputElement>document.getElementById('photo');
    const file = photo.files[0];
    const fd = new FormData();
    fd.append('file', file);
    this.$http({
      method: 'POST',
      url: `api/users/${this.currentUser._id}/sendavatar`,
      data: fd,
      headers: {
        'Content-Type': undefined
      }
    });
  }

  prepareThumbmail() {
    const photo = <HTMLInputElement>document.getElementById('photo');
    this.file = photo.files[0];
  }
}
