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
      }
    },
    getFriends: {
      method: 'GET',
      params: {
        controller: 'getfriends'
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
