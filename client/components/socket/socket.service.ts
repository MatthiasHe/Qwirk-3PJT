'use strict';
import * as _ from 'lodash';
const angular = require('angular');
const io = require('socket.io-client');

function Socket(socketFactory) {
    'ngInject';
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({ ioSocket });

    return {
      socket,

      syncFriends(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':syncFriends', function (item) {

          // replace oldItem if it exists
          // otherwise just add item to the collection

          cb(event, item, array);
        });
      },

      syncRooms(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':syncRooms', function (item) {

          // replace oldItem if it exists
          // otherwise just add item to the collection

          cb(event, item, array);
        });
      },

      syncMessages(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':syncMessages', function (item) {

          // replace oldItem if it exists
          // otherwise just add item to the collection

          cb(event, item, array);
        });
      },

      syncTest(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':syncTest', function (item) {

          // replace oldItem if it exists
          // otherwise just add item to the collection

          cb(event, item, array);
        });
      },

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
        socket.removeAllListeners(modelName + ':syncFriends');
        socket.removeAllListeners(modelName + ':syncRooms');
        socket.removeAllListeners(modelName + ':syncMessages');
      }
    };
  }

export default angular.module('qwirkApp.socket', [])
  .factory('socket', Socket)
  .name;
