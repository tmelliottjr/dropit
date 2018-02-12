'use strict';

const bcrypt = require('bcrypt-nodejs');
const urlSafeB64 = require('urlsafe-base64');
const config = require('../config/config');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reset_token: DataTypes.STRING
  });

  User.generateHash = function (data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(8), null)
  };

  User.generateToken = function () {
    let token
    let expires = new Date()

    // 1 Week Email Verification Expiration
    expires.setDate(expires.getDate() + 7)
    token = crypto.randomBytes(32).toString('hex');

    return token
  };

  User.validToken = function (token) {
    // Need to check expiration as well
  };

  User.associate = function(models){
    models.User.hasMany(models.Upload);
  };

  User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
  };

  User.prototype.sendVerificationEmail = function(req) {
        req.app.mailer.send('emails/verify', {
            to: this.email,
            subject: 'Please verify your email address to activate your account',
            layout: false,
            verifyURL: `http://${config.appHost}/verify/${this.reset_token}`,
            firstName: this.first_name
        }, function (err) {
            if (err) {
                throw err
            }
        });
    };

    User.prototype.sendPasswordResetEmail = function(req) {
        req.app.mailer.send('emails/forgot', {
            to: this.email,
            subject: 'Password reset request',
            layout: false,
            resetURL: `http://${config.appHost}/reset/${this.reset_token}`,
            firstName: this.first_name
        }, function (err) {
            if (err) {
                throw err
            }
        });
    };

  return User;
};

