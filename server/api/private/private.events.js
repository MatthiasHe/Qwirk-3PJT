/**
 * Private model events
 */

'use strict';

import {EventEmitter} from 'events';
var PrivateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PrivateEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Private) {
  for(var e in events) {
    let event = events[e];
    Private.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    PrivateEvents.emit(event + ':' + doc._id, doc);
    PrivateEvents.emit(event, doc);
  };
}

export {registerEvents};
export default PrivateEvents;
