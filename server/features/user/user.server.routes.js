'use strict';
const userCtrl = require('./user.server.controller');

module.exports = (app) => {

  app.route('/api/v1/user/:id')
    .get(userCtrl.getUser);

  app.route('/api/v1/user/:id/address')
    .put(userCtrl.updateUserAddress);
};