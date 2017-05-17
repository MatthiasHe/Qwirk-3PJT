'use strict';

export function UserResource($resource) {
  'ngInject';
  return $resource('/api/users/:id/:controller', {
    id: '@_id',
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    addFriend: {
      method: 'PUT',
      params: {
        controller: 'addfriend'
      }
    },
    searchFriend: {
      method: 'POST',
      params: {
        controller: 'searchfriend'
      },
      isArray: true
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}
