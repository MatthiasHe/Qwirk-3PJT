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
router.post('/:id/editmessage', auth.isAuthenticated(), controller.editMessage);
router.get('/:id/getmessages', auth.isAuthenticated(), controller.getMessages);
router.get('/:id/getparticipants', auth.isAuthenticated(), controller.getParticipants);
router.post('/:id/addmember', auth.isAuthenticated(), controller.addMember);
router.post('/:id/joinroom', auth.isAuthenticated(), controller.joinRoom);
router.post('/:id/leaveroom', auth.isAuthenticated(), controller.leaveRoom);
router.post('/userrooms', auth.isAuthenticated(), controller.getPublicUserRooms);
router.post('/sendfile', controller.upload.single('file'), controller.sendFile);
router.post('/:id/givemoderatorrights', auth.isAuthenticated(), controller.giveModeratorRights);
module.exports = router;
