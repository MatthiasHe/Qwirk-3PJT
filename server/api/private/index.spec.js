'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var privateCtrlStub = {
  index: 'privateCtrl.index',
  show: 'privateCtrl.show',
  create: 'privateCtrl.create',
  upsert: 'privateCtrl.upsert',
  patch: 'privateCtrl.patch',
  destroy: 'privateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var privateIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './private.controller': privateCtrlStub
});

describe('Private API Router:', function() {
  it('should return an express router instance', function() {
    privateIndex.should.equal(routerStub);
  });

  describe('GET /api/privates', function() {
    it('should route to private.controller.index', function() {
      routerStub.get
        .withArgs('/', 'privateCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/privates/:id', function() {
    it('should route to private.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'privateCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/privates', function() {
    it('should route to private.controller.create', function() {
      routerStub.post
        .withArgs('/', 'privateCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/privates/:id', function() {
    it('should route to private.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'privateCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/privates/:id', function() {
    it('should route to private.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'privateCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/privates/:id', function() {
    it('should route to private.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'privateCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
