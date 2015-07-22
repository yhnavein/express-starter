'use strict';

process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var userRepo = require('../../repositories/UserRepository');
var reqMock = { flash: function() {} };

describe('User Repository', function() {

  it('should create properly a local account', function (done) {
    var uniqueness = Date.now();
    var sampleUser = {
      email: 'test-local-' + uniqueness + '@puredev.eu',
      password: 'admin1' //:D
    };

    userRepo.createUser(sampleUser, function (err, user) {
      expect(err).to.be(null);
      expect(user).to.be.a('object');
      expect(user.password).to.not.be(null);
      expect(user.password).to.not.be(sampleUser.password); //silly check if psw has been hashed
      expect(user.email).to.be(sampleUser.email);
      done();
    });
  });

  describe('Facebook OAuth', function() {

    it('should create properly a new user from facebook', function (done) {
      var uniqueness = Date.now();
      var email = 'test-fb-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var refreshToken = 'refToken' + uniqueness;
      var profile = {
        id: uniqueness,
        _json: {email: email}
      };

      userRepo.createAccFromFacebook(reqMock, accessToken, refreshToken, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(uniqueness.toString());
        expect(user.password).to.be(null);
        expect(user.email).to.be(email);
        done();
      });
    });

    it('should create properly a new user from facebook with location', function (done) {
      var uniqueness = Date.now();
      var email = 'test-fb-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var refreshToken = 'refToken' + uniqueness;
      var profile = {
        id: uniqueness,
        _json: {email: email, location: {name: 'Warsaw'}}
      };

      userRepo.createAccFromFacebook(reqMock, accessToken, refreshToken, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.profile).to.be.a('object');
        expect(user.profile.location).to.be('Warsaw');
        done();
      });
    });

    it('should properly link facebook account to the existing local account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      userRepo.createUser(sampleUser, function (err, user) {
        var localReqMock = {
          flash: function () {
          }, user: user
        };
        var email = 'test-fb-' + uniqueness + '@puredev.eu';
        var accessToken = 'accToken' + uniqueness;
        var refreshToken = 'refToken' + uniqueness;
        var profile = {
          id: uniqueness,
          displayName: "Test FB UserName",
          _json: {email: email}
        };

        userRepo.linkFacebookProfile(localReqMock, accessToken, refreshToken, profile, function (fbErr, fbUser) {
          expect(fbErr).to.be(null);
          expect(fbUser).to.be.a('object');
          expect(fbUser.email).to.be(sampleUser.email);
          expect(fbUser.profile).to.be.a('object');
          expect(fbUser.profile.name).to.be(profile.displayName);
          expect(fbUser.tokens).to.be.a('object');
          expect(fbUser.tokens.facebook).to.be(accessToken);
          done();
        });
      });
    });
  });


});