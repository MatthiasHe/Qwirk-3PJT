/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/privates              ->  index
 * POST    /api/privates              ->  create
 * GET     /api/privates/:id          ->  show
 * PUT     /api/privates/:id          ->  upsert
 * PATCH   /api/privates/:id          ->  patch
 * DELETE  /api/privates/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Private from './private.model';

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

// Gets a list of Privates
export function index(req, res) {
  return Private.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Private from the DB
export function show(req, res) {
  return Private.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Private in the DB
export function create(req, res) {
  return Private.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Private in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Private.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Private in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Private.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Private from the DB
export function destroy(req, res) {
  return Private.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
