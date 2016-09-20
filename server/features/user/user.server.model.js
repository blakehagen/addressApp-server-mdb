'use strict';

const bcrypt   = require('bcryptjs');
const moment = require('moment');
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

// HASH PASSWORD //
// UserSchema.pre('save', next => {
//   let user = this;
//
//   console.log('user :::::::: >>> ', user);
//
//   if (!user.isModified('password')) {
//     return next();
//   }
//
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err);
//     }
//
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//
//       user.password = hash;
//       next();
//     });
//   });
// });

// CHECK IF PASSWORD VALID //
// UserSchema.methods.validPassword = password => {
//   return bcrypt.compareSync(password, this.password);
// };


// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


module.exports = mongoose.model('User', UserSchema);