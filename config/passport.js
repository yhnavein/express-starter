'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var secrets = require('./secrets');
var db = require('../models/sequelize');
var UserRepo = require('../repositories/UserRepository');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id).then(function(user) {
    done(null, user);
  }).catch(function(error) {
    done(error);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  email = email.toLowerCase();
  db.User.findUser(email, password, function(err, user) {
    if(err)
      return done(err, null);
    return done(null, user);
  });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    UserRepo.linkFacebookProfile(req, accessToken, refreshToken, profile, done);
  } else {
    UserRepo.createAccFromFacebook(req, accessToken, refreshToken, profile, done);
  }
}));

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy(secrets.github, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    UserRepo.linkGithubProfile(req, accessToken, refreshToken, profile, done);
  } else {
    UserRepo.createAccFromGithub(req, accessToken, refreshToken, profile, done);
  }
}));

/**
 * Sign in with Twitter.
 */
passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    UserRepo.linkTwitterProfile(req, accessToken, tokenSecret, profile, done);
  } else {
    UserRepo.createAccFromTwitter(req, accessToken, tokenSecret, profile, done);
  }
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    UserRepo.linkGoogleProfile(req, accessToken, refreshToken, profile, done);
  } else {
    UserRepo.createAccFromGoogle(req, accessToken, refreshToken, profile, done);
  }
}));

/**
 * Sign in with LinkedIn.
 */
passport.use(new LinkedInStrategy(secrets.linkedin, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    UserRepo.linkLinkedInProfile(req, accessToken, refreshToken, profile, done);
  } else {
    UserRepo.createAccFromLinkedIn(req, accessToken, refreshToken, profile, done);
  }
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (req.user.tokens[provider]) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};