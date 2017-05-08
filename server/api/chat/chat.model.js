'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './chat.events';

var ChatSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ChatSchema);
export default mongoose.model('Chat', ChatSchema);
