'use strict';

var express = require('express');
var controller = require('./room.controller');

import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.post('/createmessage', controller.createMessage);
router.get('/:id/getmessages', auth.isAuthenticated(), controller.getMessages);
module.exports = router;
