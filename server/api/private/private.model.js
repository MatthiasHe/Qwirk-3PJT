'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './private.events';

var PrivateSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(PrivateSchema);
export default mongoose.model('Private', PrivateSchema);
