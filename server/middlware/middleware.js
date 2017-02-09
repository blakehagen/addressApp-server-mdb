'use strict';

const _      = require('lodash');
const jwt    = require('jwt-simple');
// const secret = require('../config/secret');

module.exports = {

  isAuthenticated: (req, res, next) => {

    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized');
    }

    let token = _.last(req.headers.authorization.split(' '));

    let decoded = jwt.decode(token, process.env.JWT_SECRET || _.get(secret, 'tokenSecret'));

    if (_.isError(decoded) || !decoded) {
      return res.status(401).send('Unauthorized');
    } else {
      console.log('about to hit next!');
      return next();
    }
  }

};