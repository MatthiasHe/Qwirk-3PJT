'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: 'LoginController',
      controllerAs: 'loginCtrl'
    })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller: function ($state, Auth, $http) {
        'ngInject';
        var referrer = $state.params.referrer
          || $state.current.referrer
          || 'main';
        $http.get('api/users/me').then(response => {
          this.$http.post(`api/users/${response.data._id}/setstate`, {state: 'Offline'});
        });
        Auth.logout();
        $state.go(referrer);
      }
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'signupCtrl'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'settingsCtrl',
      authenticate: true
    });
}

