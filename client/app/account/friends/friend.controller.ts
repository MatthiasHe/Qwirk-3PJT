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

  $onInit() {
    this.Auth.addFriend('matt');
    this.Auth.addFriend('jean');
  }

  addFriend() {
    this.submitted = true;
    console.log(this.nickname);
    this.Auth.addFriend(this.nickname);
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
