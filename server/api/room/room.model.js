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
  roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
  author: String,
  authorAvatar: String,
  image: {type: Boolean, default: false}
});

var RoomSchema = new mongoose.Schema({
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  private: {type: Boolean, default: true},
  privateMulti: {type: Boolean, default: false},
  name: String,
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  moderators: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

registerEvents(RoomSchema);
registerEventsM(MessageSchema);
export default mongoose.model('Room', RoomSchema);
export var Message = mongoose.model('Message', MessageSchema);
