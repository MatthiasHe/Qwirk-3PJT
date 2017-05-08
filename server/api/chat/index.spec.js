'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var chatCtrlStub = {
  index: 'chatCtrl.index',
  show: 'chatCtrl.show',
  create: 'chatCtrl.create',
  upsert: 'chatCtrl.upsert',
  patch: 'chatCtrl.patch',
  destroy: 'chatCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var chatIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './chat.controller': chatCtrlStub
});

describe('Chat API Router:', function() {
  it('should return an express router instance', function() {
    chatIndex.should.equal(routerStub);
  });

  describe('GET /api/chats', function() {
    it('should route to chat.controller.index', function() {
      routerStub.get
        .withArgs('/', 'chatCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/chats/:id', function() {
    it('should route to chat.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'chatCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/chats', function() {
    it('should route to chat.controller.create', function() {
      routerStub.post
        .withArgs('/', 'chatCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/chats/:id', function() {
    it('should route to chat.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'chatCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/chats/:id', function() {
    it('should route to chat.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'chatCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/chats/:id', function() {
    it('should route to chat.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'chatCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
