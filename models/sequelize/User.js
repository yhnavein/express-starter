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
  authenticate: function(plainText){
    return this.encryptPassword(plainText) === this.password;
  },
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
  getFullname: function() {
    return [this.firstname, this.lastname].join(' ');
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

module.exports = function(db, DataTypes) {
  var User = db.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
      notNull: true
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
      notNull: true,
      isEmail: true
    },
    profile: DataTypes.JSON
  }, {
    tableName: 'pl_users',
    instanceMethods: instanceMethods,
    classMethods: {
      associate: function(models) {
        //User.hasMany(models.Role);
      },
      getByEmailOrUserName: function(nameOrPassword) {
        return User.find({ where: db.or(
          { email: name },
          { userName: name }
        )});
      }
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