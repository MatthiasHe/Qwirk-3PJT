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
  $http;
  currentUser;
  upload;
  birthDate;
  file;
  bio;

  /*@ngInject*/
  constructor(Auth, $http, Upload) {
    this.Auth = Auth;
    this.$http = $http;
    this.upload = Upload;
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
    // this.birthDate;
    this.$http.post(`/api/users/${this.currentUser._id}/editprofile`, {bio: this.bio, birthDate: this.birthDate});
    this.sendAvatar();
  }

  prepareThumbmail() {
    const photo = <HTMLInputElement>document.getElementById('photo');
    this.file = photo.files[0];
  }
}
