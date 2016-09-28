'use strict';

const authCtrl = require('./auth.server.controller');
const jwt      = require('jwt-simple');
// const secret   = require('../../config/secret');

module.exports = (app) => {

  app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
  });

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

    var decoded = jwt.decode(token, process.env.JWT_SECRET || 'test');
    console.log('===== decoded token =====:::::> ', decoded);

    res.status(200).json({message: 'PERMISSION GRANTED. YAY!'});

  })

};