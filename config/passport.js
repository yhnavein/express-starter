'use strict';

var passport = require('passport');
// var InstagramStrategy = require('passport-instagram').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
// var OAuthStrategy = require('passport-oauth').OAuthStrategy;
// var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

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
 * Sign in with Instagram.
 */
// passport.use(new InstagramStrategy(secrets.instagram,function(req, accessToken, refreshToken, profile, done) {
//   if (req.user) {
//     User.findOne({ instagram: profile.id.toString() }, function(err, existingUser) {
//       if (existingUser) {
//         req.flash('errors', { msg: 'There is already an Instagram account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
//         done(err);
//       } else {
//         User.findById(req.user.id, function(err, user) {
//           user.instagram = profile.id.toString();
//           user.tokens.push({ kind: 'instagram', accessToken: accessToken });
//           user.profile.name = user.profile.name || profile.displayName;
//           user.profile.picture = user.profile.picture || profile._json.data.profile_picture;
//           user.profile.website = user.profile.website || profile._json.data.website;
//           user.save(function(err) {
//             req.flash('info', { msg: 'Instagram account has been linked.' });
//             done(err, user);
//           });
//         });
//       }
//     });
//   } else {
//     User.findOne({ instagram: profile.id.toString() }, function(err, existingUser) {
//       if (existingUser) return done(null, existingUser);

//       var user = new User();
//       user.instagram = profile.id.toString();
//       user.tokens.push({ kind: 'instagram', accessToken: accessToken });
//       user.profile.name = profile.displayName;
//       // Similar to Twitter API, assigns a temporary e-mail address
//       // to get on with the registration process. It can be changed later
//       // to a valid e-mail address in Profile Management.
//       user.email = profile.username + "@instagram.com";
//       user.profile.website = profile._json.data.website;
//       user.profile.picture = profile._json.data.profile_picture;
//       user.save(function(err) {
//         done(err, user);
//       });
//     });
//   }
// }));

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
 * Tumblr API OAuth.
 */
// passport.use('tumblr', new OAuthStrategy({
//     requestTokenURL: 'http://www.tumblr.com/oauth/request_token',
//     accessTokenURL: 'http://www.tumblr.com/oauth/access_token',
//     userAuthorizationURL: 'http://www.tumblr.com/oauth/authorize',
//     consumerKey: secrets.tumblr.consumerKey,
//     consumerSecret: secrets.tumblr.consumerSecret,
//     callbackURL: secrets.tumblr.callbackURL,
//     passReqToCallback: true
//   },
//   function(req, token, tokenSecret, profile, done) {
//     User.findById(req.user._id, function(err, user) {
//       user.tokens.push({ kind: 'tumblr', accessToken: token, tokenSecret: tokenSecret });
//       user.save(function(err) {
//         done(err, user);
//       });
//     });
//   }
// ));

/**
 * Foursquare API OAuth.
 */
// passport.use('foursquare', new OAuth2Strategy({
//     authorizationURL: 'https://foursquare.com/oauth2/authorize',
//     tokenURL: 'https://foursquare.com/oauth2/access_token',
//     clientID: secrets.foursquare.clientId,
//     clientSecret: secrets.foursquare.clientSecret,
//     callbackURL: secrets.foursquare.redirectUrl,
//     passReqToCallback: true
//   },
//   function(req, accessToken, refreshToken, profile, done) {
//     User.findById(req.user._id, function(err, user) {
//       user.tokens.push({ kind: 'foursquare', accessToken: accessToken });
//       user.save(function(err) {
//         done(err, user);
//       });
//     });
//   }
// ));

/**
 * Venmo API OAuth.
 */
// passport.use('venmo', new OAuth2Strategy({
//     authorizationURL: 'https://api.venmo.com/v1/oauth/authorize',
//     tokenURL: 'https://api.venmo.com/v1/oauth/access_token',
//     clientID: secrets.venmo.clientId,
//     clientSecret: secrets.venmo.clientSecret,
//     callbackURL: secrets.venmo.redirectUrl,
//     passReqToCallback: true
//   },
//   function(req, accessToken, refreshToken, profile, done) {
//     User.findById(req.user._id, function(err, user) {
//       user.tokens.push({ kind: 'venmo', accessToken: accessToken });
//       user.save(function(err) {
//         done(err, user);
//       });
//     });
//   }
// ));

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