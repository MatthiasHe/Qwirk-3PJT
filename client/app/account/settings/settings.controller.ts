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
  Upload;
  currentUser;

  /*@ngInject*/
  constructor(Auth, $http, Upload) {
    this.Auth = Auth;
    this.$http = $http;
    this.Upload = Upload;
  }

  $onInit() {
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
    });
  }

  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
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

    /*    const photo = <HTMLInputElement>document.getElementById('photo');
     const file = photo.files[0];
     // var fd = new FormData();
     // fd.append('file', file);
     //get the total amount of files attached to the file input.
     //create a new fromdata instance
     //check if the filecount is greater than zero, to be sure a file was selected.
     //append the key name 'photo' with the first file in the element
     this.$http.post('api/users/sendavatar', {file: file});*/

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
    // this.$http.post('api/users/sendavatar', { data: fd }, { headers: {
    //   'Content-Type': undefined
    // } );
  }
}
