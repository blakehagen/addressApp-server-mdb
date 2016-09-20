'use strict';

const models = require('../../models/index');
const jwt    = require('jwt-simple');

module.exports = {

  // CREATE ADDRESS FOR USER //
  createAddress: (req, res) => {

    console.log('req.body========> ', req.body);

    if (!req.headers.authorization) {
      return res.status(401).json('Unauthorized');
    }

    var token   = req.headers.authorization.split(' ')[1];
    var decoded = jwt.decode(token, process.env.JWT_SECRET || 'test');
    if (!decoded) {
      return res.status(401).json('Unauthorized');
    }

    let newAddress = {
      address1: req.body.address1,
      address2: req.body.address2 || null,
      apt_suite: req.body.apt_suite || null,
      city: req.body.city,
      state_province: req.body.state_province,
      postal_code: req.body.postal_code,
      country: req.body.country,
      UserId: req.body.UserId
    };

    models.Address.create(newAddress).then(newAddress => {

      res.status(200).json({message: 'Address Created', address: newAddress})

    }).catch(err => {
      res.status(500).send(err);
    })
  },

  // UPDATE ADDRESS BY ADDRESS ID //
  updateAddress: (req, res) => {
    console.log('req.body========> ', req.body);
    models.Address.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(result => {
        console.log('rows updated ==>', result);
        models.User.findById(req.body.UserId, {
          include: models.Address
        }).then(user => {
          console.log('updated user ??????  :::::::::::>>>>', user);
          res.status(200).json(user);
        }).catch(error => {
          res.status(500).json(error);
        })
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }


};

