'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var roomCtrlStub = {
  index: 'roomCtrl.index',
  show: 'roomCtrl.show',
  create: 'roomCtrl.create',
  upsert: 'roomCtrl.upsert',
  patch: 'roomCtrl.patch',
  destroy: 'roomCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var roomIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './room.controller': roomCtrlStub
});

describe('Room API Router:', function() {
  it('should return an express router instance', function() {
    roomIndex.should.equal(routerStub);
  });

  describe('GET /api/rooms', function() {
    it('should route to room.controller.index', function() {
      routerStub.get
        .withArgs('/', 'roomCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/rooms/:id', function() {
    it('should route to room.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'roomCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/rooms', function() {
    it('should route to room.controller.create', function() {
      routerStub.post
        .withArgs('/', 'roomCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/rooms/:id', function() {
    it('should route to room.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'roomCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/rooms/:id', function() {
    it('should route to room.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'roomCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/rooms/:id', function() {
    it('should route to room.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'roomCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
