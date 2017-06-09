'use strict';
// @flow
interface User {
  name: string;
  email: string;
  password: string;
}

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {login: undefined};
  submitted = false;
  Auth;
  $state;
  $http;

  /*@ngInject*/
  constructor(Auth, $state, $http) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          this.$http.get('api/users/me').then(response => {
            this.$http.post(`api/users/${response.data._id}/setstate`, {state: 'Offline'});
          });
          this.$state.go('main');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
