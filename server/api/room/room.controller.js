/* eslint-disable no-unused-vars,no-duplicate-imports */
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/rooms              ->  index
 * POST    /api/rooms              ->  create
 * GET     /api/rooms/:id          ->  show
 * PUT     /api/rooms/:id          ->  upsert
 * PATCH   /api/rooms/:id          ->  patch
 * DELETE  /api/rooms/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Room from './room.model';
import {Message} from './room.model';
import mongoose from 'mongoose';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Rooms
export function index(req, res) {
  return Room.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Room from the DB
export function show(req, res) {
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Room in the DB
export function create(req, res) {
  var params = {
    admin: mongoose.Types.ObjectId(req.body.adminId),
    members: mongoose.Types.ObjectId(req.body.memberId),
    name: req.body.name
  };
  Room.create(params)
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}

// Upserts the given Room in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Room.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Room in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Room from the DB
export function destroy(req, res) {
  return Room.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function createMessage(req, res) {
  var params = {
    text: req.body.text,
    author: mongoose.Types.ObjectId(req.body.author),
    roomId: mongoose.Types.ObjectId(req.body.roomId)
  };
  Message.create(params)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

export function getMessages(req, res) {
  var roomId = req.body.roomId;
  Message.find({roomId: req.params.id}).exec()
    .then(messages => { // don't ever give out the password or sa@lt
      if(!messages) {
        return res.status(401).end();
      }
      return res.json(messages);
    })
    .catch(err => next(err));
}
