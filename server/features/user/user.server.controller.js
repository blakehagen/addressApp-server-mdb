'use strict';

const User = require('./user.server.model');

module.exports = {

  // GET ONE USER BY ID //
  getUser: (req, res) => {

    console.log('req.params ========> ', req.params);
    console.log('req.headers.authorization', req.headers.authorization);

    // if (!req.headers.authorization) {
    //   res.status(401).json({message: 'Unauthorized'});
    // }


    User.findById(req.params.id).select('firstName lastName email').exec((error, user) => {
      if (error) {
        res.status(500).json(error);
      }
      res.status(200).json(user);
    })
  }

};