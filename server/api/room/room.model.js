'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './room.events';

var MessageSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  name: String,
  text: String,
  scribble: {type: Boolean, default: false},
  roomId: mongoose.Schema.Types.ObjectId,
  origin: mongoose.Schema.Types.ObjectId
});

var RoomSchema = new mongoose.Schema({
  messages: [MessageSchema],
  private: {type: Boolean, default: true},
  name: String,
  admin: mongoose.Schema.Types.ObjectId,
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  kind: String,
  lastMessageDate: {type: Date, default: Date.now()},
  img: String,
});

export default mongoose.model('Room', RoomSchema);
export var Message = mongoose.model('Message', MessageSchema);
