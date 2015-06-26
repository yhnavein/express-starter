'use strict';

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

//HMAC version
// var secrets = require('../config/secrets');
// function createHash(string) {
//   if(!string)
//     return null;

//   var hashKey = secrets.localAuth.hashKey;
//   var hmac = crypto.createHmac(secrets.localAuth.hashMethod, new Buffer(hashKey, 'utf-8'));
//   return hmac.update(new Buffer(string, 'utf-8')).digest('hex');
// }

var instanceMethods = {
  encryptPassword: function(password, cb) {
    if (!password) return '';
    bcrypt.genSalt(10, function(err, salt) {
      if (err) { cb(null, err); return; }
      bcrypt.hash(password, salt, null, function(hErr, hash) {
        if (hErr) { cb(null, hErr); return; }
        cb(hash, null);
      });
    });
  },
  getGravatarUrl: function(size) {
    if (!size) size = 200;

    if (!this.email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  }
};

var beforeSaveHook = function(user, options, fn) {
  if(user.changed('password')) {
    user.encryptPassword(user.password, function(hash, err) {
      user.password = hash;
      fn(null, user);
    });
    return;
  }
  fn(null, user);
};

module.exports = function(db, DataTypes) {
  var User = db.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    password: DataTypes.STRING,
    googleId: {
      type: DataTypes.STRING,
      unique: true
    },
    facebookId: {
      type: DataTypes.STRING,
      unique: true
    },
    twitterId: {
      type: DataTypes.STRING,
      unique: true
    },
    linkedInId: {
      type: DataTypes.STRING,
      unique: true
    },
    githubId: {
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    logins: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      isEmail: true
    },
    profile: DataTypes.JSON,
    tokens: DataTypes.JSON
  }, {
    tableName: 'pl_users',
    instanceMethods: instanceMethods,
    classMethods: {
      associate: function(models) {
        //User.hasMany(models.Role);
      },
      findUser: function(email, password) {
        this.encryptPassword(password, function(hashPsw, err) {
          return User.find({
            where: db.and(
                { email: email },
                { password: hashPsw }
            )
          });
        });
      }
    },
    hooks: {
      beforeUpdate: beforeSaveHook,
      beforeCreate: beforeSaveHook
    },
    indexes: [
      {
        name: 'facebookIdIndex',
        method: 'BTREE',
        fields: ['facebookId']
      },
      {
        name: 'googleIdIndex',
        method: 'BTREE',
        fields: ['googleId']
      },
      {
        name: 'twitterIdIndex',
        method: 'BTREE',
        fields: ['twitterId']
      },
      {
        name: 'linkedInIdIndex',
        method: 'BTREE',
        fields: ['linkedInId']
      },
      {
        name: 'githubIdIndex',
        method: 'BTREE',
        fields: ['githubId']
      }
    ]
  });

  return User;
};