'use strict';

var expect = require('expect.js');
var userRepo = require('../../../repositories/UserRepository');
var bcrypt = require('bcrypt-nodejs');

describe('User Repository', function() {

  describe('Basic Stuff', function() {
    it('should create properly a local account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };

      userRepo.createUser(sampleUser)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.password).to.not.be(null);
          expect(user.email).to.be(sampleUser.email);

          bcrypt.compare(sampleUser.password, user.password, function(err, res) {
            expect(res).to.be(true);
            done();
          });
        })
        .catch(function() {
          expect().fail('It should not happen');
          done();
        });
    });

    it('should properly change password in DB', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      var newPassword = 'admin2';

      userRepo.createUser(sampleUser)
        .then(function(user) {
          return userRepo.changeUserPassword(user.id, newPassword);
        })
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.password).to.not.be(null);

          bcrypt.compare(newPassword, user.password, function(err, res) {
            expect(res).to.be(true);
            done();
          });
        })
        .catch(function() {
          expect().fail('It should not happen');
          done();
        });
    });

    it('should handle properly creation of account with an existing email', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-l1-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };

      userRepo.createUser(sampleUser)
        .then(function() {
          return userRepo.createUser(sampleUser);
        })
        .then(function() {
          expect().fail('It should not happen');
          done();
        })
        .catch(function(err) {
          expect(err).to.be('Account with that email address already exists.');
          done();
        });
    });

    it('should successfully change profile data', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };

      var newProfile = {
        email: sampleUser.email,
        name: 'Test name',
        gender: 'male',
        location: 'Helsinki',
        website: 'http://microsoft.com',
      };

      userRepo.createUser(sampleUser)
        .then(function(user) {
          expect(user.email).to.be(sampleUser.email);

          return userRepo.changeProfileData(user.id, newProfile);
        })
        .then(function(user) {
          expect(user.email).to.be(newProfile.email);
          expect(user.profile.name).to.be(newProfile.name);
          expect(user.profile.gender).to.be(newProfile.gender);
          expect(user.profile.location).to.be(newProfile.location);
          expect(user.profile.website).to.be(newProfile.website);

          done();
        })
        .catch(function() {
          expect().fail('It should not happen');
          done();
        });
    });

    it('should successfully change e-mail to the different one', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };

      var newProfile = {
        email: 'new-test-local-' + uniqueness + '@puredev.eu',
      };

      userRepo.createUser(sampleUser)
        .then(function(user) {
          expect(user.email).to.be(sampleUser.email);

          return userRepo.changeProfileData(user.id, newProfile);
        })
        .then(function(user) {
          expect(user.email).to.be(newProfile.email);
          done();
        })
        .catch(function() {
          expect().fail('It should not happen');
          done();
        });
    });
  });

  describe('Facebook OAuth', function() {
    function createUser() {
      var uniqueness = Date.now();

      return {
        uniqueness: uniqueness,
        email: 'test-fb-' + uniqueness + '@puredev.eu',
        accessToken: 'accToken' + uniqueness,
        refreshToken: 'refToken' + uniqueness,
        profile: { id: uniqueness }
      };
    }

    it('should create properly a new user from facebook', function (done) {
      var $u = createUser();
      $u.profile._json = {email: $u.email};

      userRepo.createAccFromFacebook($u.accessToken, $u.refreshToken, $u.profile)
        .then(function (user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be($u.uniqueness.toString());
          expect(user.password).to.be(null);
          expect(user.email).to.be($u.email);
          done();
        })
        .catch(function() {
          expect().fail('It should not happen');
          done();
        });
    });

    it('should handle properly situation when email returned from facebook is empty', function (done) {
      var $u = createUser();
      $u.profile._json = { email: null };

      userRepo.createAccFromFacebook($u.accessToken, $u.refreshToken, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be($u.uniqueness.toString());
          expect(user.password).to.be(null);
          expect(user.email).to.be(user.facebookId + '@facebook.com');
          done();
        });
    });

    it('should create properly a new user from facebook with a full profile', function (done) {
      var $u = createUser();

      //structure of the profile is from the actual request, yet data is totally randomized
      //Sorry, Garrett Alexion!
      var sampleProfile = {
        id: $u.uniqueness.toString(),
        username: undefined,
        displayName: 'Garrett Alexion',
        name: {
          familyName: 'Alexion',
          givenName: 'Garrett',
          middleName: undefined
        },
        gender: 'male',
        profileUrl: 'http://www.facebook.com/297638351',
        emails: [
          {
            value: $u.email
          }
        ],
        provider: 'facebook',
        _json: {
          id: $u.uniqueness.toString(),
          email: $u.email,
          first_name: 'Garrett',
          gender: 'male',
          last_name: 'Alexion',
          link: 'http://www.facebook.com/297638351',
          locale: 'en_US',
          name: 'Garrett Alexion',
          timezone: 2,
          updated_time: '2015-06-06T15:55:07+0000',
          verified: true
        }
      };

      userRepo.createAccFromFacebook($u.accessToken, $u.refreshToken, sampleProfile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be(sampleProfile.id);
          expect(user.email).to.be($u.email);
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
      var $u = createUser();

      userRepo.createUser(sampleUser)
        .then(function(user) {
          $u.profile._json = {email: $u.email};
          $u.profile.displayName = "Test FB UserName";

          return userRepo.linkFacebookProfile(user.id, $u.accessToken, $u.refreshToken, $u.profile);
        })
        .then(function(fbUser) {
          expect(fbUser).to.be.a('object');
          expect(fbUser.email).to.be(sampleUser.email);
          expect(fbUser.profile).to.be.a('object');
          expect(fbUser.profile.name).to.be($u.profile.displayName);
          expect(fbUser.tokens).to.be.a('object');
          expect(fbUser.tokens.facebook).to.be($u.accessToken);
          done();
        });
    });

    it('should properly unlink linked facebook account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      var $u = createUser();
      userRepo.createUser(sampleUser)
        .then(function(user) {
          $u.profile._json = {email: $u.email};

          return userRepo.linkFacebookProfile(user.id, $u.accessToken, $u.refreshToken, $u.profile);
        })
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.not.be(null);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.facebook).to.be($u.accessToken);

          return userRepo.unlinkProviderFromAccount('facebook', user.id);
        })
        .then(function(user) {
          expect(user.tokens.facebook).to.be(null);
          expect(user.facebookId).to.be(null);

          done();
        });
    });
  });

  describe('GitHub OAuth', function() {
    function createUser() {
      var uniqueness = Date.now();

      return {
        uniqueness: uniqueness,
        email: 'test-gh-' + uniqueness + '@puredev.eu',
        accessToken: 'accToken' + uniqueness,
        tokenSecret: 'secToken' + uniqueness,
        profile: { id: uniqueness }
      };
    }

    it('should create properly a new user from github', function (done) {
      var $u = createUser();
      $u.profile.emails = [ {value: $u.email} ];

      userRepo.createAccFromGithub($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be(null);
          expect(user.githubId).to.be($u.uniqueness.toString());
          expect(user.password).to.be(null);
          expect(user.email).to.be($u.email);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.github).to.be($u.accessToken);
          done();
        });
    });

    it('should create properly a new user from github with location', function (done) {
      var $u = createUser();
      $u.profile.emails = [ {value: $u.email} ];
      $u.profile._json = {location: 'Warsaw'};

      userRepo.createAccFromGithub($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.profile).to.be.a('object');
          expect(user.profile.location).to.be('Warsaw');
          done();
        });
    });

    it('should create properly a new user where there is no email returned from GitHub', function (done) {
      var $u = createUser();
      $u.profile.emails = [ {value: ''} ];

      userRepo.createAccFromGithub($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.profile).to.be.a('object');
          expect(user.email).to.be($u.uniqueness + '@github.com');
          done();
        });
    });

    it('should create properly a github full profile', function (done) {
      var $u = createUser();

      var sampleProfile = {
        provider: 'github',
        id: $u.uniqueness,
        displayName: 'Manda Gilgour',
        username: '',
        profileUrl: 'https://github.com/mangil',
        emails: [ { value: '' } ],
        _json: {
          login: 'mangil',
          id: $u.uniqueness,
          avatar_url: 'https://avatars.githubusercontent.com/u/794984?v=3',
          gravatar_id: '',
          url: 'https://api.github.com/users/mangil',
          html_url: 'https://github.com/mangil',
          followers_url: 'https://api.github.com/users/mangil/followers',
          following_url: 'https://api.github.com/users/mangil/following{/other_user}',
          gists_url: 'https://api.github.com/users/mangil/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/mangil/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/mangil/subscriptions',
          organizations_url: 'https://api.github.com/users/mangil/orgs',
          repos_url: 'https://api.github.com/users/mangil/repos',
          events_url: 'https://api.github.com/users/mangil/events{/privacy}',
          received_events_url: 'https://api.github.com/users/mangil/received_events',
          type: 'User',
          site_admin: false,
          name: 'Manda Gilgour',
          company: 'PureDev',
          blog: 'http://brineman.com/ecclesiologist/elizabethan?a=courter&b=rockiness#izar',
          location: 'Warsaw',
          email: '',
          hireable: true,
          bio: null,
          public_repos: 26,
          public_gists: 7,
          followers: 54,
          following: 21,
          created_at: '2010-12-09T18:47:46Z',
          updated_at: '2015-07-22T14:44:14Z'
        }
      };
      userRepo.createAccFromGithub($u.accessToken, $u.tokenSecret, sampleProfile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.profile).to.be.a('object');
          expect(user.profile.name).to.be(sampleProfile.displayName);
          expect(user.profile.location).to.be(sampleProfile._json.location);
          expect(user.profile.picture).to.be(sampleProfile._json.avatar_url);
          expect(user.profile.website).to.be(sampleProfile._json.blog);
          done();
        });
    });

    it('should properly link github account to the existing local account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local1-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      var $u = createUser();

      userRepo.createUser(sampleUser)
        .then(function(user) {
          $u.profile._json = {email: $u.email};
          $u.profile.displayName = "Test GH UserName";

          return userRepo.linkGithubProfile(user.id, $u.accessToken, $u.tokenSecret, $u.profile);
        })
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.email).to.be(sampleUser.email);
          expect(user.profile).to.be.a('object');
          expect(user.profile.name).to.be($u.profile.displayName);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.github).to.be($u.accessToken);
          done();
        });
    });
  });

  describe('Google OAuth', function() {
    function createUser() {
      var uniqueness = Date.now();
      var email = 'test-gg-' + uniqueness + '@puredev.eu';

      return {
        uniqueness: uniqueness,
        email: email,
        accessToken: 'accToken' + uniqueness,
        tokenSecret: 'secToken' + uniqueness,
        profile: { id: uniqueness, emails: [{ value: email }], _json: {} }
      };
    }

    it('should create properly a new user from google', function (done) {
      var $u = createUser();

      userRepo.createAccFromGoogle($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be(null);
          expect(user.googleId).to.be($u.uniqueness.toString());
          expect(user.password).to.be(null);
          expect(user.email).to.be($u.email);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.google).to.be($u.accessToken);
          done();
        });
    });

    it('should create properly a new user from google with picture', function (done) {
      var $u = createUser();
      $u.profile._json.image = {url: 'PICTURE_URL'};

      userRepo.createAccFromGoogle($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.profile).to.be.a('object');
          expect(user.profile.picture).to.be('PICTURE_URL');
          done();
        });
    });

    it('should create properly a new user from a full google profile', function (done) {
      var $u = createUser();
      $u.profile._json.picture = 'PICTURE_URL';

      var sampleProfile = {
        provider: 'google',
        id: '864852638' + $u.uniqueness,
        displayName: 'Lacy Hucks',
        name: { familyName: 'Hucks', givenName: 'Lacy' },
        emails: [ { value: $u.email, type: 'account' } ],
        photos: [ { value: 'https://biota.com/kolobus/overcondensation?a=kidneyroot&b=sear#mataeologue' } ],
        gender: 'male',
        _json: {
          kind: 'plus#person',
          etag: '"6de4a3e9-645e-4044-87ba-2c25689b58c9"',
          gender: 'male',
          emails: [ [Object] ],
          urls: [ [Object] ],
          objectType: 'person',
          id: '864852638' + $u.uniqueness,
          displayName: 'Lacy Hucks',
          name: { familyName: 'Hucks', givenName: 'Lacy' },
          braggingRights: 'unaffrighted',
          url: 'https://plus.google.com/+LacyHucks',
          image:
          {
            url: 'https://biota.com/kolobus/overcondensation?a=kidneyroot&b=sear#mataeologue',
            isDefault: false
          },
          placesLived: [ [Object], [Object] ],
          isPlusUser: true,
          language: 'en_GB',
          verified: false,
          cover: {
            layout: 'banner', coverPhoto: [Object], coverInfo: [Object]
          }
        }
      };

      userRepo.createAccFromGoogle($u.accessToken, $u.tokenSecret, sampleProfile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.profile).to.be.a('object');
          expect(user.profile.picture).to.be(sampleProfile._json.image.url);
          expect(user.profile.name).to.be(sampleProfile.displayName);
          expect(user.profile.gender).to.be(sampleProfile.gender);
          done();
        });
    });

    it('should properly link google account to the existing local account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local2-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      var $u = createUser();

      userRepo.createUser(sampleUser)
        .then(function(user) {
          $u.profile.displayName = "Test GG UserName";

          return userRepo.linkGoogleProfile(user.id, $u.accessToken, $u.tokenSecret, $u.profile);
        })
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.email).to.be(sampleUser.email);
          expect(user.profile).to.be.a('object');
          expect(user.profile.name).to.be($u.profile.displayName);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.google).to.be($u.accessToken);
          done();
        });
    });
  });

  describe('Twitter OAuth', function() {
    function createUser() {
      var uniqueness = Date.now();

      return {
        uniqueness: uniqueness,
        accessToken: 'accToken' + uniqueness,
        tokenSecret: 'secToken' + uniqueness,
        profile: { username: 'Twitter-' + uniqueness, id: uniqueness, _json: {} }
      };
    }

    it('should create properly a new user from twitter', function (done) {
      var $u = createUser();

      userRepo.createAccFromTwitter($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be(null);
          expect(user.twitterId).to.be($u.uniqueness.toString());
          expect(user.password).to.be(null);
          expect(user.email).to.be($u.profile.username + '@twitter.com');
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.twitter).to.be($u.accessToken);
          expect(user.tokens.twitterSecret).to.be($u.tokenSecret);
          done();
        });
    });

    it('should create properly a new user from twitter with picture', function (done) {
      var $u = createUser();
      $u.profile._json.profile_image_url_https = 'PICTURE_URL';

      userRepo.createAccFromTwitter($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
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
      var $u = createUser();

      userRepo.createUser(sampleUser)
        .then(function(user) {
          return userRepo.linkTwitterProfile(user.id, $u.accessToken, $u.tokenSecret, $u.profile);
        })
        .then(function(twUser) {
          expect(twUser).to.be.a('object');
          expect(twUser.email).to.be(sampleUser.email);
          expect(twUser.profile).to.be.a('object');
          expect(twUser.profile.name).to.be($u.profile.displayName);
          expect(twUser.tokens).to.be.a('object');
          expect(twUser.tokens.twitter).to.be($u.accessToken);
          expect(twUser.tokens.twitterSecret).to.be($u.tokenSecret);
          done();
        });
    });

    it('should properly unlink linked twitter account', function (done) {
      var uniqueness = Date.now();
      var sampleUser = {
        email: 'test-local2-' + uniqueness + '@puredev.eu',
        password: 'admin1' //:D
      };
      var $u = createUser();

      userRepo.createUser(sampleUser)
        .then(function(user) {
          return userRepo.linkTwitterProfile(user.id, $u.accessToken, $u.tokenSecret, $u.profile);
        })
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.twitterId).to.not.be(null);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.twitter).to.be($u.accessToken);
          expect(user.tokens.twitterSecret).to.be($u.tokenSecret);

          return userRepo.unlinkProviderFromAccount('twitter', user.id);
        })
       .then(function(user) {
          expect(user.tokens.twitter).to.be(null);
          expect(user.tokens.twitterSecret).to.be(null);
          expect(user.twitterId).to.be(null);

          done();
        });
    });
  });

  describe('LinkedIn OAuth', function() {
    function createUser() {
      var uniqueness = Date.now();
      var email = 'test-li-' + uniqueness + '@puredev.eu';

      return {
        uniqueness: uniqueness,
        email: email,
        accessToken: 'accToken' + uniqueness,
        tokenSecret: 'secToken' + uniqueness,
        profile: { id: uniqueness, _json: { emailAddress: email } }
      };
    }

    it('should create properly a new user from linkedin', function (done) {
      var $u = createUser();

      userRepo.createAccFromLinkedIn($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.facebookId).to.be(null);
          expect(user.linkedInId).to.be($u.uniqueness.toString());
          expect(user.password).to.be(null);
          expect(user.email).to.be($u.email);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.linkedin).to.be($u.accessToken);
          done();
        });
    });

    it('should create properly a new user from linkedin with picture', function (done) {
      var $u = createUser();
      $u.profile._json.pictureUrl = 'PICTURE_URL';
      $u.profile._json.location = { name: 'Warsaw' };

      userRepo.createAccFromLinkedIn($u.accessToken, $u.tokenSecret, $u.profile)
        .then(function(user) {
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
      var $u = createUser();

      userRepo.createUser(sampleUser)
        .then(function(user) {
          $u.profile.displayName = "Test TW UserName";

          return userRepo.linkLinkedInProfile(user.id, $u.accessToken, $u.tokenSecret, $u.profile);
        })
        .then(function(user) {
          expect(user).to.be.a('object');
          expect(user.email).to.be(sampleUser.email);
          expect(user.profile).to.be.a('object');
          expect(user.profile.name).to.be($u.profile.displayName);
          expect(user.tokens).to.be.a('object');
          expect(user.tokens.linkedin).to.be($u.accessToken);
          done();
        });
    });
  });

  describe('Reset Password Functionality', function() {
    it('should password be changed properly', function(done) {
      var uniqueness = Date.now();
      var newPassword = 'admin2';
      var token = 'abcdef0123456789' + uniqueness;
      var sampleUser = {
        email: 'test-local123-' + uniqueness + '@puredev.eu',
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 36000000,
        password: 'admin1' //:D
      };

      userRepo.createUser(sampleUser)
        .then(function() {
          return userRepo.changeUserPswAndResetToken(token, newPassword);
        })
        .then(function(user) {
          expect(user).to.not.be(null);
          expect(user.resetPasswordToken).to.be(null);
          expect(user.resetPasswordExpires).to.be(null);

          bcrypt.compare(newPassword, user.password, function(err, res) {
            expect(res).to.be(true);
            done();
          });
        });
    });
  });

});