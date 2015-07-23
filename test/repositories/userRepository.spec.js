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


  describe('GitHub OAuth', function() {
    it('should create properly a new user from github', function (done) {
      var uniqueness = Date.now();
      var email = 'test-gh-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        _json: {email: email}
      };

      userRepo.createAccFromGithub(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(null);
        expect(user.githubId).to.be(uniqueness.toString());
        expect(user.password).to.be(null);
        expect(user.email).to.be(email);
        expect(user.tokens).to.be.a('object');
        expect(user.tokens.github).to.be(accessToken);
        done();
      });
    });

    it('should create properly a new user from github with location', function (done) {
      var uniqueness = Date.now();
      var email = 'test-gh-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        _json: { email: email, location: 'Warsaw' }
      };

      userRepo.createAccFromGithub(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.profile).to.be.a('object');
        expect(user.profile.location).to.be('Warsaw');
        done();
      });
    });

    it('should properly link github account to the existing local account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local1-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      userRepo.createUser(sampleUser, function (err, user) {
        var localReqMock = {
          flash: function () {
          }, user: user
        };
        var email = 'test-gh-' + uniqueness + '@puredev.eu';
        var accessToken = 'accToken' + uniqueness;
        var tokenSecret = 'secToken' + uniqueness;
        var profile = {
          id: uniqueness,
          displayName: "Test GH UserName",
          _json: {email: email}
        };

        userRepo.linkGithubProfile(localReqMock, accessToken, tokenSecret, profile, function (ghErr, ghUser) {
          expect(ghErr).to.be(null);
          expect(ghUser).to.be.a('object');
          expect(ghUser.email).to.be(sampleUser.email);
          expect(ghUser.profile).to.be.a('object');
          expect(ghUser.profile.name).to.be(profile.displayName);
          expect(ghUser.tokens).to.be.a('object');
          expect(ghUser.tokens.github).to.be(accessToken);
          done();
        });
      });
    });
  });

  describe('Google OAuth', function() {
    it('should create properly a new user from google', function (done) {
      var uniqueness = Date.now();
      var email = 'test-gg-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        emails: [{ value: email }],
        _json: {}
      };

      userRepo.createAccFromGoogle(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(null);
        expect(user.googleId).to.be(uniqueness.toString());
        expect(user.password).to.be(null);
        expect(user.email).to.be(email);
        expect(user.tokens).to.be.a('object');
        expect(user.tokens.google).to.be(accessToken);
        done();
      });
    });

    it('should create properly a new user from google with picture', function (done) {
      var uniqueness = Date.now();
      var email = 'test-gg-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        emails: [{ value: email }],
        _json: {picture: 'PICTURE_URL'}
      };

      userRepo.createAccFromGoogle(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.profile).to.be.a('object');
        expect(user.profile.picture).to.be('PICTURE_URL');
        done();
      });
    });

    it('should properly link google account to the existing local account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local2-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      userRepo.createUser(sampleUser, function (err, user) {
        var localReqMock = {
          flash: function () {
          }, user: user
        };
        var email = 'test-gg-' + uniqueness + '@puredev.eu';
        var accessToken = 'accToken' + uniqueness;
        var tokenSecret = 'secToken' + uniqueness;
        var profile = {
          id: uniqueness,
          emails: [{ value: email }],
          displayName: "Test GG UserName",
          _json: {}
        };

        userRepo.linkGoogleProfile(localReqMock, accessToken, tokenSecret, profile, function (ggErr, ggUser) {
          expect(ggErr).to.be(null);
          expect(ggUser).to.be.a('object');
          expect(ggUser.email).to.be(sampleUser.email);
          expect(ggUser.profile).to.be.a('object');
          expect(ggUser.profile.name).to.be(profile.displayName);
          expect(ggUser.tokens).to.be.a('object');
          expect(ggUser.tokens.google).to.be(accessToken);
          done();
        });
      });
    });
  });

});