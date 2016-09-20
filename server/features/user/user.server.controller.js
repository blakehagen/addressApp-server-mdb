'use strict';

const models = require('../../models/index');

module.exports = {

  // GET ONE USER BY ID //
  getUser: (req, res) => {

    models.User.findById(req.params.id, {
      include: models.Address
    }).then(user => {
      res.status(200).json(user);
    })
  }


};