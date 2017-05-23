'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './room.events';

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

export default mongoose.model('Room', RoomSchema);
export var Message = mongoose.model('Message', MessageSchema);
