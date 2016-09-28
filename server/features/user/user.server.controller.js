'use strict';

const User = require('./user.server.model');

module.exports = {

  // GET ONE USER BY ID //
  getUser: (req, res) => {

    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized');
    }


    User.findById(req.params.id).select('firstName lastName email').exec((error, user) => {
      if (error) {
        res.status(500).json(error);
      }
      res.status(200).json(user);
    })
  }

};