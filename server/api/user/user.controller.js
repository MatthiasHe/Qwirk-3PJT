'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import userEvent from './user.events';


const multer = require('multer');
var path = require('path');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/Users/matt/Desktop/projectTest/client/assets/avatar');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
export const upload = multer({ storage: storage });

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({token, user});
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').populate('friends.user friends.room request awaitingRequest').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      return res.json(user);
    })
    .catch(err => next(err));
}

/*export function removeRequest(req, res) {
  var userId = req.params.id;
  var newFriendId = req.body.friendId;
  User.findById(userId).populate('request').exec()
    .then(user => {
      user.request.forEach(function(request, index) {
        if(request._id == newFriendId) {
          user.request.splice(index, 1);
        }
      });
      // user.update({$push: {friends: {user: userId, room: roomId}}});
      // user.update({$pull: {awaitingRequest: userId}});
      user.save();
    });
}*/

/**
 * Add a friend
 */
export function addFriend(req, res) {
  var userId = req.params.id;
  var roomId = req.body.roomId;
  var newFriendId = req.body.friendId;
  // console.log(userId);
  // console.log(roomId);
  // console.log(newFriendId);
  //
  // User.findById(userId).populate('friends request').exec()
  //   .then(user => {
  //     if(user.friends == undefined) {
  //       user.friends = [];
  //     }
  //     user.friends.push(mongoose.Types.ObjectId(newFriendId));
  //     user.request.forEach(function(request, index) {
  //       if(request._id == newFriendId) {
  //         user.request.splice(index, 1);
  //       }
  //     });
  //     user.update({$push: {friends: {user: userId, room: roomId}}});
  //     user.update({$pull: {awaitingRequest: userId}});
  //     console.log(user);
  //     user.save();
  // });
  //
  // User.findById(newFriendId).populate('friends request').exec()
  //   .then(user => {
  //     if(user.friends == undefined) {
  //       user.friends = [];
  //     }
  //     user.friends.push(mongoose.Types.ObjectId(userId));
  //     user.request.forEach(function(request, index) {
  //       if(request._id == userId) {
  //         user.request.splice(index, 1);
  //       }
  //     });
  //     user.update({$push: {friends: {user: userId, room: roomId}}});
  //     user.update({$pull: {awaitingRequest: userId}});
  //     console.log(user);
  //     user.save();
  //   });
  //
  // User.find(userId).exec().then(user => {
  //   user.update({$pull: {request: newFriendId}});
  //   user.update({$push: {friends: {user: newFriendId, room: roomId}}});
  //   user.save();
  // });

  User.findByIdAndUpdate(newFriendId, {$push: {friends: {user: userId, room: roomId}}}).then(newresponse => {
  });
  User.findByIdAndUpdate(newFriendId, {$pull: {awaitingRequest: userId}}).then(newresponse => {
  });
  User.findByIdAndUpdate(userId, {$pull: {request: newFriendId}}).then(newresponse => {
  });
  User.findByIdAndUpdate(userId, {$push: {friends: {user: newFriendId, room: roomId}}}).then(newresponse => {
    User.findById(userId).populate('friends.user friends.room request awaiting').exec()
      .then(user => {
        userEvent.emit('syncFriends', user.friends);
        userEvent.emit('syncRequest', user.request);
        userEvent.emit('syncAwaiting', user.awaitingRequest);
      });
    User.findById(newFriendId).populate('friends.user friends.room request').exec()
      .then(user => {
        userEvent.emit('syncFriends', user.friends);
        userEvent.emit('syncRequest', user.request);
        userEvent.emit('syncAwaiting', user.awaitingRequest);
      });
  });
}

export function rejectFriend(req, res) {
  var userId = req.params.id;
  var newFriendId = req.body.friendId;

  User.findByIdAndUpdate(newFriendId, {$pull: {awaitingRequest: userId}}).then(newresponse => {
  });
  User.findByIdAndUpdate(userId, {$pull: {request: newFriendId}}).then(newresponse => {
  });
}

export function searchFriend(req, res) {
  var userList;
  var name = req.body.nickname;
  User.find({name: new RegExp('^' + name)}).exec()
    .then(response => {
      userList = response;
      return res.json(userList);
    });
}

export function getFriends(req, res) {
  var userId = req.params.id;
  User.findOne({_id: userId}).exec()
    .then(users => { // don't ever give out the password or salt
      if(!users) {
        return res.status(401).end();
      }
      return res.json(users.friends);
    })
    .catch(err => next(err));
}
export function sendFriendRequest(req, res) {
  var userId = req.params.id;
  var friendId = req.body.friendId;
  User.findByIdAndUpdate(friendId, {$push: {request: userId}}).then(response => {
  });
  return User.findByIdAndUpdate(userId, {$push: {awaitingRequest: friendId}}).then(response => {
    User.findById(userId).populate('friends.user friends.room request awaitingRequest').exec()
      .then(user => {
        userEvent.emit('syncFriends', user.friends);
        userEvent.emit('syncRequest', user.request);
        userEvent.emit('syncAwaitingRequest', user.awaitingRequest);
      });
    User.findById(friendId).populate('friends.user friends.room request').exec()
      .then(user => {
        userEvent.emit('syncFriends', user.friends);
        userEvent.emit('syncRequest', user.request);
        userEvent.emit('syncAwaitingRequest', user.awaitingRequest);
        console.log(user.request);
      });
  });
}

export function getFriendRequest(req, res) {
  var userId = req.params.id;
  User.findOne({_id: userId}).populate('request').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      return res.json(user.request);
    })
    .catch(err => next(err));
}

export function getAwaitingRequest(req, res) {
  var userId = req.params.id;
  User.findOne({_id: userId}).populate('awaitingRequest').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      return res.json(user.awaitingRequest);
    })
    .catch(err => next(err));
}

export function sendAvatar(req, res) {
  const userId = req.params.id;
  const avatarPath = req.body.avatarPath;
  User.findByIdAndUpdate(userId, {avatar: avatarPath}).then(response => {
  });
}

export function editSurname(req, res) {
  const friendId = req.body.friendId;
  const userId = req.params.id;
  const newSurname = req.body.newSurname;
  User.update({_id: userId, 'friends._id': friendId},
    {$set: {
      'friends.0.nickname': newSurname,
    }},
    function(err, model) {
      if(err) {
        console.log(err);
        return res.send(err);
      }
      return res.json(model);
    });
}

export function sendAvatarFile(req, res) {
  return res.json(req.file.filename);
}

export function deleteFriend(req, res) {
  var userId = req.params.id;
  var friendId = req.body.friendId;
  var friendObjectId;

  User.findByIdAndUpdate({_id: friendId, 'friends.user': userId}, { $pull: {friends: { user: userId}}})
    .exec(function(err,data) {
    });
  User.findOne({'friends.user': friendId}).then(response => {
    User.findByIdAndUpdate({_id: userId, 'friends.user': response.friends[0].user}, { $pull: {friends: { user: response.friends[0].user}}})
      .exec(function(err,data) {
      });
  });
}

export function setState(req, res) {
  var userId = req.params.id;
  var state = req.body.state;
  User.findByIdAndUpdate(userId, {state: state}).then(response => {
  });
}


/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
