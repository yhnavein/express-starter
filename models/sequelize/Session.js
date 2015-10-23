'use strict';

var config = require('../../config/secrets');

module.exports = function(db, DataTypes) {
    var Session = db.define('Session', {
        sid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        sess: {
            type: DataTypes.JSON,
            allowNull: false
        },
        expire: {
            type: DataTypes.DATE(6),
            allowNull: false
        }
    }, {
        tableName: config.sessionTable,
        timestamps: false
    });

    return Session;
};