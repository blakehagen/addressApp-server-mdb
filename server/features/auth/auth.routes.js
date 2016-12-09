'use strict';

const authCtrl = require('./auth.server.controller');
const jwt      = require('jwt-simple');
// const secret   = require('../../config/secret');

module.exports = (app) => {

  // ======================= //
  // USER SIGN UP / REGISTER //
  // ======================= //
  app.route('/api/v1/signup')
    .post(authCtrl.register);

  // ========== //
  // USER LOGIN //
  // ========== //
  app.route('/api/v1/login')
    .post(authCtrl.login);

  // TEST TEST TEST //
  app.get('/api/v1/protected', (req, res) => {

    if (!req.headers.authorization) {
      return res.status(401).json('Unauthorized');
    }

    var token = req.headers.authorization.split(' ')[1];

    var decoded = jwt.decode(token, process.env.JWT_SECRET);
    console.log('===== decoded token =====:::::> ', decoded);

    res.status(200).json({message: 'PERMISSION GRANTED. YAY!'});

  })

};