'use strict';
// @flow
const angular = require('angular');

export default class FriendsCtrl {
  nickname: String;
  errors = {};
  submitted = false;
  data;
  Auth;
  currentUser;
  friends;
  friendTest;
  searchResult;
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
    this.$http.get('api/users/me').then(response => {
      this.currentUser = response.data;
      this.friends = this.currentUser.friends;
      // seed friend
/*      this.$http.post('api/users/searchfriend', { nickname: 'mat' }).then(newresponse => {
        this.searchResult = newresponse.data;
        this.$http.post(`api/users/${this.currentUser._id}/addfriend`, { friendId : this.searchResult});
      });*/
      // fin du seed
    });
  }

  addFriend() {
    this.submitted = true;
    this.$http.post('api/users/searchfriend', { nickname: this.nickname }).then(response => {
      this.searchResult = response.data;
      this.friends.forEach( friend => {
        if (friend._id === this.searchResult) {
          this.friendTest = true;
        }
      });
      if (this.friendTest) {
/*        let friendInput = <HTMLInputElement>document.getElementById('friend-input');
        friendInput.setCustomValidity('Cet utilisateur est déjà présent dans votre liste d\'amis.');*/
        this.$http.post(`api/users/${this.currentUser._id}/sendrequest`, { friendId: this.searchResult });
      } else {
        this.$http.post(`api/users/${this.currentUser._id}/sendrequest`, { friendId: this.searchResult });
      }
    });
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
