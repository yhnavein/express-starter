'use strict';

process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var userRepo = require('../../repositories/UserRepository');
var reqMock = { flash: function() {} };

describe('User Repository', function() {
  it('should create properly a new user from facebook', function(done) {
    var uniqueness = Date.now();
    var email = 'test-fb-' + uniqueness + '@puredev.eu';
    var accessToken = 'accToken' + uniqueness;
    var refreshToken = 'refToken' + uniqueness;
    var profile = {
      id: uniqueness,
      _json: { email: email }
    };

    userRepo.createAccFromFacebook(reqMock, accessToken, refreshToken, profile, function(err, user) {
      expect(err).to.be.null;
      expect(user).to.exist;
      expect(user.facebookId).to.be.equal(uniqueness.toString());
      expect(user.password).to.be.null;
      expect(user.email).to.be.equal(email);
      done();
    });
  });

  it('should create properly a new user from facebook with location', function(done) {
    var uniqueness = Date.now();
    var email = 'test-fb-' + uniqueness + '@puredev.eu';
    var accessToken = 'accToken' + uniqueness;
    var refreshToken = 'refToken' + uniqueness;
    var profile = {
      id: uniqueness,
      _json: { email: email, location: { name: 'Warsaw' } }
    };

    userRepo.createAccFromFacebook(reqMock, accessToken, refreshToken, profile, function(err, user) {
      expect(err).to.be.null;
      expect(user).to.exist;
      expect(user.profile).to.be.notNull;
      expect(user.profile.location).to.be.equal('Warsaw');
      done();
    });
  });
});
