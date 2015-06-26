'use strict';

var _ = require('lodash');
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
    db.User.findOne({ where: { facebookId: profile.id.toString() } }).then(function(existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done('UserExists');
      } else {
        db.User.findById(req.user.id).then(function(user) {
          user.facebookId = profile.id.toString();
          if(!user.tokens) user.tokens = {};
          if(!user.profile) user.profile = {};
          user.tokens.facebook = accessToken;
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id.toString() + '/picture?type=large';
          user.save()
            .then(function(savedUser) {
              req.flash('info', { msg: 'Facebook account has been linked.' });
              done(null, savedUser);
            })
            .catch(function(error) { done(error); });
        });
      }
    });
  } else {
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
  }
}));

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy(secrets.github, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    db.User.findOne({ where: { githubId: profile.id.toString() } }).then(function(existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done('UserExists');
      } else {
        db.User.findById(req.user.id).then(function(user) {
          user.githubId = profile.id.toString();
          user.tokens.github = accessToken;
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
          user.save()
            .then(function(savedUser) {
              req.flash('info', { msg: 'GitHub account has been linked.' });
              done(null, savedUser);
            })
            .catch(function(error) { done(error); });
        });
      }
    });
  } else {
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
  }
}));

// Sign in with Twitter.

passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    db.User.findOne({ where: { twitterId: profile.id.toString() } }).then(function(existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done('UserExists');
      } else {
        db.User.findById(req.user.id).then(function(user) {
          user.twitterId = profile.id.toString();
          user.tokens.twitter = accessToken;
          user.tokens.twitterSecret = tokenSecret;
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
          user.save()
            .then(function(savedUser) {
              req.flash('info', { msg: 'Twitter account has been linked.' });
              done(null, savedUser);
            })
            .catch(function(error) { done(error); });
        });
      }
    });

  } else {
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
  }
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    db.User.findOne({ where: { googleId: profile.id.toString() } }).then(function(existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done('UserExists');
      } else {
        db.User.findById(req.user.id).then(function(user) {
          user.googleId = profile.id.toString();
          user.tokens.google = accessToken;
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.picture;
          user.save()
            .then(function(savedUser) {
              req.flash('info', { msg: 'Google account has been linked.' });
              done(null, savedUser);
            })
            .catch(function(error) { done(error); });
        });
      }
    });
  } else {
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
  }
}));

/**
 * Sign in with LinkedIn.
 */
passport.use(new LinkedInStrategy(secrets.linkedin, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    db.User.findOne({ where: { linkedin: profile.id.toString() } }).then(function(existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done('UserExists');
      } else {
        db.User.findById(req.user.id).then(function(user) {
          user.linkedin = profile.id.toString();
          user.tokens.linkedin = accessToken;
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.location = user.profile.location || profile._json.location.name;
          user.profile.picture = user.profile.picture || profile._json.pictureUrl;
          user.profile.website = user.profile.website || profile._json.publicProfileUrl;
          user.save()
            .then(function(savedUser) {
              req.flash('info', { msg: 'Google account has been linked.' });
              done(null, savedUser);
            })
            .catch(function(error) { done(error); });
        });
      }
    });
  } else {
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

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};