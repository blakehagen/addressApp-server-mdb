'use strict';

const bcrypt   = require('bcryptjs');
const moment   = require('moment');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
  userCreated: {type: Date, default: new Date()},
  userCreated_readable: {type: String, default: moment().format('LLL')},
  firstName: {type: String},
  lastName: {type: String},
  email: {type: String},
  password: {type: String},
});

// CHECK IF PASSWORD VALID //
UserSchema.methods.validPassword = (password, savedPassword) => {
  return bcrypt.compareSync(password, savedPassword);
};

// GENERATE HASH //
UserSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = mongoose.model('User', UserSchema);