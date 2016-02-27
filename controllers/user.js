'use strict';

var crypto;
var async = require('neo-async');
var passport = require('passport');

var UserRepo = require('../repositories/UserRepository.js');
var emailService = require('../services/emailService.js');


exports.getLogin = function(req, res) {
  if (req.user)
    return res.redirect('/account');

  res.render('account/login', {
    title: 'Login'
  });
};

exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (!user || err) {
      req.flash('errors', { msg: err || info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(loginErr) {
      if (loginErr) return next(loginErr);
      req.flash('success', { msg: 'Success! You are logged in.' });
      var redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.locals.user = null;
  res.render('home', {
    title: 'Home'
  });
};

exports.getSignup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signup', {
    title: 'Create Account'
  });
};

exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  UserRepo.createUser({
      email: req.body.email,
      password: req.body.password,
      profile: {},
      tokens: {}
    })
    .then(function(user) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        req.flash('success', { msg: 'Your account has been created and you\'ve been logged in.' });
        res.redirect('/');
      });
    })
    .catch(function(err) {
      req.flash('errors', { msg: err });
      return res.redirect('/login');
    });
};

exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

exports.postUpdateProfile = function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();

  UserRepo.changeProfileData(req.user.id, req.body)
    .then(function() {
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    })
    .catch(function(err) {
      req.flash('errors', { msg: err });
      res.redirect('/account');
    });
};

exports.postUpdatePassword = function(req, res) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  UserRepo.changeUserPassword(req.user.id, req.body.password)
    .then(function() {
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    })
    .catch(function(err) {
      req.flash('errors', { msg: err });
      res.redirect('/account');
    });
};

exports.deleteAccount = function(req, res) {
  UserRepo.removeUserById(req.user.id)
    .then(function() {
      req.logout();
      req.flash('info', { msg: 'Your account has been deleted.' });
      res.json({ success: true });
    });
};

exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;

  UserRepo.unlinkProviderFromAccount(provider, req.user.id)
    .then(function() {
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  UserRepo.findUserByResetPswToken(req.params.token)
    .then(function(user) {
      if(!user)
        throw 'Password reset request is invalid or has expired.';

      res.render('account/reset', {
        title: 'Password Reset'
      });
    })
    .catch(function(err) {
      req.flash('errors', { msg: err });
      return res.redirect('/forgot');
    });
};

exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      UserRepo.changeUserPswAndResetToken(req.params.token, req.body.password)
        .then(function(user){
          req.logIn(user, function(err2) {
            done(err2, user);
          });
        })
        .catch(function(err) { done(err, null); });
    },
    function(user, done) {
      emailService.sendPasswordChangeNotificationEmail(user.email, function(err) {
        req.flash('info', {
          msg: 'Password has been successfully changed. Notification e-mail has been sent to ' + user.email + ' to inform about this fact.'
        });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

exports.postForgot = function(req, res, next) {
  crypto = require('crypto');

  req.assert('email', 'Please enter a valid email address.').isEmail();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(24, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      var email = req.body.email.toLowerCase();
      UserRepo.assignResetPswToken(email, token)
        .then(function(user){
          done(null, token, user);
        })
        .catch(function(err) {
          req.flash('errors', { msg: err });
          return res.redirect('/forgot');
        });
    },
    function(token, user, done) {
      emailService.sendRequestPasswordEmail(user.email, req.headers.host, token, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};
