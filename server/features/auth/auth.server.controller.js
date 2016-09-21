'use strict';

const User = require('../user/user.server.model');
const jwt  = require('jwt-simple');
// const secret = require('../../config/secret');

module.exports = {

  // SIGN UP / REGISTER //
  register: (req, res) => {

    User.findOne({'email': req.body.email}, (err, user) => {
      if (err) {
        return res.status(400).json(err);
      }

      if (user) {
       return res.status(400).json({message: 'E-mail already in use'});
      } else {

        let newUser = new User();

        newUser.firstName = req.body.firstName;
        newUser.lastName  = req.body.lastName;
        newUser.email     = req.body.email;
        newUser.password  = newUser.generateHash(req.body.password);

        newUser.save((err, newUser) => {
          console.log('newUser', newUser);
          if (err) {
            return err;
          }

          let token = jwt.encode({userId: newUser._id, email: newUser.email}, process.env.JWT_SECRET || 'test');

          return res.status(200).json({user: newUser, message: 'Login Success', token: token});
        });
      }
    });
  },

  // LOG IN //
  login: (req, res) => {

    User.findOne({'email': req.body.email}, (err, user) => {
      if (err) {
        return res.status(500).json(err);
      } else if (!user) {
        return res.status(400).json({message: 'Invalid login'});
      } else if (!user.validPassword(req.body.password, user.password)) {
        return res.status(400).json({message: 'Invalid password'});
      } else {

        let token = jwt.encode({userId: user.id, email: user.email}, process.env.JWT_SECRET || 'test');

        return res.status(200).json({user: user, message: 'Login Success', token: token})
      }
    });
  }
};