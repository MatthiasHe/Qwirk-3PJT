'use strict';
// @flow
const angular = require('angular');

export default class FriendsCtrl {
  nickname: String;
  errors = {};
  submitted = false;
  data;
  Auth;
  $state;
  $http;

  /*@ngInject*/
  constructor($state, $http, Auth) {
    this.nickname = '';
    this.$state = $state;
    this.$http = $http;
    this.Auth = Auth;
  }

  addFriend() {
    this.submitted = true;
    console.log(this.nickname);
    console.log(this.searchFriend(this.nickname));
/*      this.$http.get('/api/users/me').then(response => {
        this.data = response.data;
      });
      console.log(this.data);*/
    // this.Auth.addFriend('196e793466a91f927d69db');
  }

  searchFriend(nickname) {
    return this.Auth.searchFriend(nickname);
  }

/*  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Account created, redirect to home
                this.$state.go('main');      })
      .catch(err => {
        err = err.data;
        this.errors = {};
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });

      });
    }
  }*/
}
