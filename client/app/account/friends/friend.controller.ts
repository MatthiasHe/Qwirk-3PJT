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

  $timeout;
  $q;

  simulateQuery;
  isDisabled;
  states;

  /*@ngInject*/
  constructor($state, $http, Auth, $q, $timeout) {
    this.nickname = '';
    this.$state = $state;
    this.$http = $http;
    this.Auth = Auth;

    this.$timeout = $timeout;
    this.$q = $q;

    this.simulateQuery = false;
    this.isDisabled    = false;

    // list of `state` value/display objects
    this.states        = this.loadAll();
    this.querySearch   = this.querySearch;
    this.selectedItemChange = this.selectedItemChange;
    this.searchTextChange   = this.searchTextChange;

    this.newState = this.newState;
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

  newState(state) {
    alert("Sorry! You'll need to create a Constitution for " + state + " first!");
  }

  // ******************************
  // Internal methods
  // ******************************

  /**
   * Search for states... use $timeout to simulate
   * remote dataservice call.
   */
  querySearch (query) {
    var results = query ? this.states.filter( this.createFilterFor(query) ) : this.states,
      deferred;
    if (this.simulateQuery) {
      deferred = this.$q.defer();
      this.$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }

  searchTextChange(text) {
  }

  selectedItemChange(item) {
  }

  /**
   * Build `states` list of key/value pairs
   */
  loadAll() {
    var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

    return allStates.split(/, +/g).map( function (state) {
      return {
        value: state.toLowerCase(),
        display: state
      };
    });
  }

  /**
   * Create filter function for a query string
   */
  createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };

  }
}
