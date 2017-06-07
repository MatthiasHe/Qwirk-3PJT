/**
 * Room model events
 */

'use strict';

import {EventEmitter} from 'events';
var RoomEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RoomEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove',
  syncFriends: 'syncFriends'
};

// Register the event emitter to the model events
function registerEvents(Room) {
  for(var e in events) {
    let event = events[e];
    Room.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    RoomEvents.emit(event + ':' + doc._id, doc);
    RoomEvents.emit(event, doc);
  };
}

export {registerEvents};
export default RoomEvents;
