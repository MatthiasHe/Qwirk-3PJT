'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPrivate;

describe('Private API:', function() {
  describe('GET /api/privates', function() {
    var privates;

    beforeEach(function(done) {
      request(app)
        .get('/api/privates')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          privates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      privates.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/privates', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/privates')
        .send({
          name: 'New Private',
          info: 'This is the brand new private!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPrivate = res.body;
          done();
        });
    });

    it('should respond with the newly created private', function() {
      newPrivate.name.should.equal('New Private');
      newPrivate.info.should.equal('This is the brand new private!!!');
    });
  });

  describe('GET /api/privates/:id', function() {
    var private;

    beforeEach(function(done) {
      request(app)
        .get(`/api/privates/${newPrivate._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          private = res.body;
          done();
        });
    });

    afterEach(function() {
      private = {};
    });

    it('should respond with the requested private', function() {
      private.name.should.equal('New Private');
      private.info.should.equal('This is the brand new private!!!');
    });
  });

  describe('PUT /api/privates/:id', function() {
    var updatedPrivate;

    beforeEach(function(done) {
      request(app)
        .put(`/api/privates/${newPrivate._id}`)
        .send({
          name: 'Updated Private',
          info: 'This is the updated private!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPrivate = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPrivate = {};
    });

    it('should respond with the updated private', function() {
      updatedPrivate.name.should.equal('Updated Private');
      updatedPrivate.info.should.equal('This is the updated private!!!');
    });

    it('should respond with the updated private on a subsequent GET', function(done) {
      request(app)
        .get(`/api/privates/${newPrivate._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let private = res.body;

          private.name.should.equal('Updated Private');
          private.info.should.equal('This is the updated private!!!');

          done();
        });
    });
  });

  describe('PATCH /api/privates/:id', function() {
    var patchedPrivate;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/privates/${newPrivate._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Private' },
          { op: 'replace', path: '/info', value: 'This is the patched private!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPrivate = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPrivate = {};
    });

    it('should respond with the patched private', function() {
      patchedPrivate.name.should.equal('Patched Private');
      patchedPrivate.info.should.equal('This is the patched private!!!');
    });
  });

  describe('DELETE /api/privates/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/privates/${newPrivate._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when private does not exist', function(done) {
      request(app)
        .delete(`/api/privates/${newPrivate._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
