'use strict';

var db = require('../models/sequelize');

var repo = {};

repo.getUserById = function(id) {
  return db.User.findById(id);
};

repo.createUser = function(user, done) {
  var dbUser = db.User.build(user);

  dbUser.save()
    .then(function(savedUser) {
      done(null, savedUser);
    })
    .catch(function() {
      return done('User was not created correctly!', null);
    });
};


/**
 * Facebook
 */
repo.linkFacebookProfile = function(req, accessToken, refreshToken, profile, done) {
  db.User.findOne({ where: { facebookId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
      done('Facebook already linked');
    } else {
      db.User.findById(req.user.id).then(function(user) {
        user.facebookId = profile.id.toString();
        if(!user.tokens) user.tokens = {};
        if(!user.profile) user.profile = {};
        user.tokens.facebook = accessToken;
        user.profile.name = user.profile.name || profile.displayName;
        user.profile.gender = user.profile.gender || profile._json.gender;
        user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id.toString() + '/picture?type=large';
        user.set('tokens', user.tokens);
        user.set('profile', user.profile);

        user.save()
          .then(function(savedUser) {
            req.flash('info', { msg: 'Facebook account has been linked.' });
            done(null, savedUser);
          })
          .catch(function(error) { done(error); });
      });
    }
  });
};

repo.createAccFromFacebook = function(req, accessToken, refreshToken, profile, done) {
  db.User.findOne({ where: { facebookId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) return done(null, existingUser);
    db.User.findOne({ where: { email: profile._json.email } }).then(function(existingEmailUser) {
      if (existingEmailUser) {
        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
        done('UserExists');
      } else {
        var user = db.User.build({ facebookId: profile.id.toString() });
        user.email = profile._json.email;
        user.tokens = { facebook: accessToken };
        user.profile = {
          name: profile.displayName,
          gender: profile._json.gender,
          picture: 'https://graph.facebook.com/' + profile.id.toString() + '/picture?type=large',
          location: (profile._json.location) ? profile._json.location.name : ''
        };
        user.save()
          .then(function(savedUser) { done(null, savedUser); })
          .catch(function(error) { done(error); });
      }
    });
  });
};


/**
 * GitHub
 */
repo.linkGithubProfile = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { githubId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
      done('UserExists');
    } else {
      db.User.findById(req.user.id).then(function(user) {
        user.githubId = profile.id.toString();
        if(!user.tokens) user.tokens = {};
        if(!user.profile) user.profile = {};
        user.tokens.github = accessToken;
        user.profile.name = user.profile.name || profile.displayName;
        user.profile.picture = user.profile.picture || profile._json.avatar_url;
        user.profile.location = user.profile.location || profile._json.location;
        user.profile.website = user.profile.website || profile._json.blog;
        user.set('tokens', user.tokens);
        user.set('profile', user.profile);

        user.save()
          .then(function(savedUser) {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(null, savedUser);
          })
          .catch(function(error) { done(error); });
      });
    }
  });
};

repo.createAccFromGithub = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { githubId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) return done(null, existingUser);
    db.User.findOne({ where: { email: profile._json.email } }).then(function(existingEmailUser) {
      if (existingEmailUser) {
        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
        done('UserExists');
      } else {
        var user = db.User.build({ githubId: profile.id.toString() });
        user.email = profile._json.email;
        user.tokens = { github: accessToken };
        user.profile = {
          name: profile.displayName,
          picture: profile._json.avatar_url,
          location: profile._json.location,
          website: profile._json.blog
        };
        user.save()
          .then(function(savedUser) { done(null, savedUser); })
          .catch(function(error) { done(error); });
      }
    });
  });
};


/**
 * Twitter
 */
repo.linkTwitterProfile = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { twitterId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
      done('UserExists');
    } else {
      db.User.findById(req.user.id).then(function(user) {
        user.twitterId = profile.id.toString();
        if(!user.tokens) user.tokens = {};
        if(!user.profile) user.profile = {};
        user.tokens.twitter = accessToken;
        user.tokens.twitterSecret = tokenSecret;
        user.profile.name = user.profile.name || profile.displayName;
        user.profile.location = user.profile.location || profile._json.location;
        user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
        user.set('tokens', user.tokens);
        user.set('profile', user.profile);

        user.save()
          .then(function(savedUser) {
            req.flash('info', { msg: 'Twitter account has been linked.' });
            done(null, savedUser);
          })
          .catch(function(error) { done(error); });
      });
    }
  });
};

repo.createAccFromTwitter = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { twitterId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) return done(null, existingUser);
    var user = db.User.build({ twitterId: profile.id.toString() });
    user.email = profile.username + "@twitter.com";
    user.tokens = { twitter: accessToken, twitterSecret: tokenSecret };
    user.profile = {
      name: profile.displayName,
      picture: profile._json.profile_image_url_https,
      location: profile._json.location
    };
    user.save()
      .then(function(savedUser) { done(null, savedUser); })
      .catch(function(error) { done(error); });
  });
};


/**
 * Google
 */
repo.linkGoogleProfile = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { googleId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
      done('UserExists');
    } else {
      db.User.findById(req.user.id).then(function(user) {
        user.googleId = profile.id.toString();
        if(!user.tokens) user.tokens = {};
        if(!user.profile) user.profile = {};
        user.tokens.google = accessToken;
        user.profile.name = user.profile.name || profile.displayName;
        user.profile.gender = user.profile.gender || profile._json.gender;
        user.profile.picture = user.profile.picture || profile._json.picture;
        user.set('tokens', user.tokens);
        user.set('profile', user.profile);

        user.save()
          .then(function(savedUser) {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(null, savedUser);
          })
          .catch(function(error) { done(error); });
      });
    }
  });
};

repo.createAccFromGoogle = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { googleId: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) return done(null, existingUser);
    db.User.findOne({ where: { email: profile.emails[0].value } }).then(function(existingEmailUser) {
      if (existingEmailUser) {
        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
        done('UserExists');
      } else {
        var user = db.User.build({ googleId: profile.id.toString() });
        user.email = profile.emails[0].value;
        user.tokens = { google: accessToken };
        user.profile = {
          name: profile.displayName,
          gender: profile._json.gender,
          picture: profile._json.picture
        };
        user.save()
          .then(function(savedUser) { done(null, savedUser); })
          .catch(function(error) { done(error); });
      }
    });
  });
};


/**
 * LinkedIn
 */
repo.linkLinkedInProfile = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { linkedin: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
      done('UserExists');
    } else {
      db.User.findById(req.user.id).then(function(user) {
        user.linkedin = profile.id.toString();
        if(!user.tokens) user.tokens = {};
        if(!user.profile) user.profile = {};
        user.tokens.linkedin = accessToken;
        user.profile.name = user.profile.name || profile.displayName;
        user.profile.location = user.profile.location || profile._json.location.name;
        user.profile.picture = user.profile.picture || profile._json.pictureUrl;
        user.profile.website = user.profile.website || profile._json.publicProfileUrl;
        user.set('tokens', user.tokens);
        user.set('profile', user.profile);

        user.save()
          .then(function(savedUser) {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(null, savedUser);
          })
          .catch(function(error) { done(error); });
      });
    }
  });
};

repo.createAccFromLinkedIn = function(req, accessToken, tokenSecret, profile, done) {
  db.User.findOne({ where: { linkedin: profile.id.toString() } }).then(function(existingUser) {
    if (existingUser) return done(null, existingUser);
    db.User.findOne({ where: { email: profile._json.emailAddress } }).then(function(existingEmailUser) {
      if (existingEmailUser) {
        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.' });
        done('UserExists');
      } else {
        var user = db.User.build({ linkedinId: profile.id.toString() });
        user.email = profile._json.emailAddress;
        user.tokens = { linkedin: accessToken };
        user.profile = {
          name: profile.displayName,
          location: profile._json.location.name,
          picture: profile._json.pictureUrl,
          website: profile._json.publicProfileUrl
        };
        user.save()
          .then(function(savedUser) { done(null, savedUser); })
          .catch(function(error) { done(error); });
      }
    });
  });
};

module.exports = repo;