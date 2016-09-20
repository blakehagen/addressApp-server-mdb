'use strict';

const models = require('../../models/index');
const jwt    = require('jwt-simple');
// const secret = require('../../config/secret');

module.exports = {

  // SIGN UP / REGISTER //
  register: (req, res) => {

    models.User.findOne({
      where: {
        'email': req.body.email
      }
    }).then(user => {
      if (user) {
        return res.status(400).json({message: 'E-mail already in use'});
      } else {

        let newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: models.User.generateHash(req.body.password)
        };

        models.User.create(newUser).then(user => {
          let token = jwt.encode({userId: user.id, email: user.email}, process.env.JWT_SECRET || 'test');
          return res.status(200).json({user: user, message: 'Registration Success', token: token});
        })
      }
    }).catch(err => {
      return res.status(500).send(err);
    })
  },

  // LOG IN //
  login: (req, res) => {

    models.User.findOne({
      where: {
        'email': req.body.email
      }
    }).then(user => {
      if (!user) {
        return res.status(400).json({message: 'Invalid login'});
      } else if (!user.validPassword(req.body.password)) {
        return res.status(400).json({message: 'Invalid password'});
      } else {
        let token = jwt.encode({userId: user.id, email: user.email}, process.env.JWT_SECRET || 'test');
        return res.status(200).json({user: user, message: 'Login Success', token: token})
      }
    }).catch(err => {
      console.log('err', err);
      return res.status(500).send(err);
    })
  }
};