'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './room.events';
import {registerEventsM} from './message.events';

var MessageSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  text: String,
  roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'RoomSchema'},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var RoomSchema = new mongoose.Schema({
  messages: [MessageSchema],
  private: {type: Boolean, default: true},
  name: String,
  admin: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

registerEvents(RoomSchema);
registerEventsM(MessageSchema);
export default mongoose.model('Room', RoomSchema);
export var Message = mongoose.model('Message', MessageSchema);
