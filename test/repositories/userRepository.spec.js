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

    it('should respond with error when empty json property is passed from facebook', function (done) {
      var uniqueness = Date.now();
      var accessToken = 'accToken' + uniqueness;
      var refreshToken = 'refToken' + uniqueness;
      var profile = { id: uniqueness };

      userRepo.createAccFromFacebook(reqMock, accessToken, refreshToken, profile, function (err, user) {
        expect(err).to.not.be(null);
        expect(user).to.be(null);
        done();
      });
    });

    it('should create properly a new user from facebook with a full profile', function (done) {
      var uniqueness = Date.now();
      var profileId = uniqueness.toString();
      var email = 'test-fb-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var refreshToken = 'refToken' + uniqueness;
      //structure of the profile is from the actual request, yet data is totally randomized
      //Sorry, Garrett Alexion!
      var sampleProfile = {
        id: profileId,
        username:undefined,
        displayName:'Garrett Alexion',
        name:{
          familyName:'Alexion',
          givenName:'Garrett',
          middleName:undefined
        },
        gender:'male',
        profileUrl:'http://www.facebook.com/297638351',
        emails:[
          {
            value:email
          }
        ],
        provider:'facebook',
        _json:{
          id: profileId,
          email:email,
          first_name:'Garrett',
          gender:'male',
          last_name:'Alexion',
          link:'http://www.facebook.com/297638351',
          locale:'en_US',
          name:'Garrett Alexion',
          timezone:2,
          updated_time:'2015-06-06T15:55:07+0000',
          verified:true
        }
      };

      userRepo.createAccFromFacebook(reqMock, accessToken, refreshToken, sampleProfile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(sampleProfile.id);
        expect(user.email).to.be(email);
        expect(user.profile).to.be.a('object');
        expect(user.profile.name).to.be(sampleProfile.displayName);
        expect(user.profile.gender).to.be(sampleProfile.gender);
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

  describe('Twitter OAuth', function() {
    it('should create properly a new user from twitter', function (done) {
      var uniqueness = Date.now();
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        username: 'Twitter-' + uniqueness,
        _json: {}
      };

      userRepo.createAccFromTwitter(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(null);
        expect(user.twitterId).to.be(uniqueness.toString());
        expect(user.password).to.be(null);
        expect(user.email).to.be(profile.username + '@twitter.com');
        expect(user.tokens).to.be.a('object');
        expect(user.tokens.twitter).to.be(accessToken);
        expect(user.tokens.twitterSecret).to.be(tokenSecret);
        done();
      });
    });

    it('should create properly a new user from twitter with picture', function (done) {
      var uniqueness = Date.now();
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;

      var profile = {
        id: uniqueness,
        username: 'Twitter-' + uniqueness,
        _json: {profile_image_url_https: 'PICTURE_URL'}
      };

      userRepo.createAccFromTwitter(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.profile).to.be.a('object');
        expect(user.profile.picture).to.be('PICTURE_URL');
        done();
      });
    });

    it('should properly link twitter account to the existing local account', function (done) {
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
        var accessToken = 'accToken' + uniqueness;
        var tokenSecret = 'secToken' + uniqueness;
        var profile = {
          id: uniqueness,
          username: 'Twitter-' + uniqueness,
          displayName: "Test TW UserName",
          _json: {}
        };

        userRepo.linkTwitterProfile(localReqMock, accessToken, tokenSecret, profile, function (twErr, twUser) {
          expect(twErr).to.be(null);
          expect(twUser).to.be.a('object');
          expect(twUser.email).to.be(sampleUser.email);
          expect(twUser.profile).to.be.a('object');
          expect(twUser.profile.name).to.be(profile.displayName);
          expect(twUser.tokens).to.be.a('object');
          expect(twUser.tokens.twitter).to.be(accessToken);
          expect(twUser.tokens.twitterSecret).to.be(tokenSecret);
          done();
        });
      });
    });
  });

  describe('LinkedIn OAuth', function() {
    it('should create properly a new user from linkedin', function (done) {
      var uniqueness = Date.now();
      var email = 'test-li-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        _json: {emailAddress: email }
      };

      userRepo.createAccFromLinkedIn(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.facebookId).to.be(null);
        expect(user.linkedInId).to.be(uniqueness.toString());
        expect(user.password).to.be(null);
        expect(user.email).to.be(email);
        expect(user.tokens).to.be.a('object');
        expect(user.tokens.linkedin).to.be(accessToken);
        done();
      });
    });

    it('should create properly a new user from linkedin with picture', function (done) {
      var uniqueness = Date.now();
      var email = 'test-li-' + uniqueness + '@puredev.eu';
      var accessToken = 'accToken' + uniqueness;
      var tokenSecret = 'secToken' + uniqueness;
      var profile = {
        id: uniqueness,
        _json: {emailAddress: email, pictureUrl: 'PICTURE_URL', location: { name: 'Warsaw' }}
      };

      userRepo.createAccFromLinkedIn(reqMock, accessToken, tokenSecret, profile, function (err, user) {
        expect(err).to.be(null);
        expect(user).to.be.a('object');
        expect(user.profile).to.be.a('object');
        expect(user.profile.picture).to.be('PICTURE_URL');
        expect(user.profile.location).to.be('Warsaw');
        done();
      });
    });

    it('should properly link linkedin account to the existing local account', function (done) {
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
        var email = 'test-li-' + uniqueness + '@puredev.eu';
        var accessToken = 'accToken' + uniqueness;
        var tokenSecret = 'secToken' + uniqueness;
        var profile = {
          id: uniqueness,
          displayName: "Test TW UserName",
          _json: {emailAddress: email}
        };

        userRepo.linkLinkedInProfile(localReqMock, accessToken, tokenSecret, profile, function (liErr, liUser) {
          expect(liErr).to.be(null);
          expect(liUser).to.be.a('object');
          expect(liUser.email).to.be(sampleUser.email);
          expect(liUser.profile).to.be.a('object');
          expect(liUser.profile.name).to.be(profile.displayName);
          expect(liUser.tokens).to.be.a('object');
          expect(liUser.tokens.linkedin).to.be(accessToken);
          done();
        });
      });
    });
  });

});