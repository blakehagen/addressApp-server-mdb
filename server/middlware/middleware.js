'use strict';

const _      = require('lodash');
const jwt    = require('jwt-simple');

module.exports = {

  isAuthenticated: (req, res, next) => {

    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized');
    }

    let token = _.last(req.headers.authorization.split(' '));

    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).send('Unauthorized');
    } else {
      return next();
    }
  }

};