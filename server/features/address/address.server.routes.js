'use strict';
const addressCtrl = require('./address.server.controller');

module.exports = (app) => {

  app.route('/api/v1/address/')
    .post(addressCtrl.createAddress);

  app.route('/api/v1/address/:id')
    .put(addressCtrl.updateAddress);

};