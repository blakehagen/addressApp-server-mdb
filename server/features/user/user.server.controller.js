'use strict';

const User = require('./user.server.model');

module.exports = {

  // GET ONE USER BY ID //
  getUser: (req, res) => {

    // TODO add middleware to check for verified user via authToken //
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized');
    }

    User.findById(req.params.id).select('firstName lastName email address').exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(user);
    })
  }

};