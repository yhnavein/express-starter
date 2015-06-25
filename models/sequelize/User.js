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
      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) { cb(null, err); return; }
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
    id_user: {
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
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    twitterId: DataTypes.STRING,
    date_created: DataTypes.DATE,
    date_modified: DataTypes.DATE,
    logins: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      unique: true,
      notNull: true,
      isEmail: true
    }
  }, {
    tableName: 'pl_users',
    updatedAt: 'date_modified',
    createdAt: 'date_created',
    instanceMethods: instanceMethods,
    classMethods: {
      associate: function(models) {
        //User.hasMany(models.Role);
      },
      getByEmailOrUserName: function(name, password, callback) {
        User.find({ where: db.or(
          { email: name },
          { userName: name }
        )}).then(callback);
      }
    }
  });

  return User;
};