'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.post('/:id/addfriend', auth.isAuthenticated(), controller.addFriend);
router.post('/:id/deletefriend', auth.isAuthenticated(), controller.deleteFriend);
router.post('/:id/rejectrequest', auth.isAuthenticated(), controller.rejectFriend);
router.post('/searchfriend', auth.isAuthenticated(), controller.searchFriend);
router.get('/:id/getfriends', auth.isAuthenticated(), controller.getFriends);
router.post('/:id/sendrequest', auth.isAuthenticated(), controller.sendFriendRequest);
router.get('/:id/getfriendrequest', auth.isAuthenticated(), controller.getFriendRequest);
router.get('/:id/getawaitingrequest', auth.isAuthenticated(), controller.getAwaitingRequest);
router.post('/:id/editsurname', auth.isAuthenticated(), controller.editSurname);
router.post('/:id/sendavatar', auth.isAuthenticated(), controller.sendAvatar);
router.post('/sendavatarfile', controller.upload.single('file'), controller.sendAvatarFile);

module.exports = router;
