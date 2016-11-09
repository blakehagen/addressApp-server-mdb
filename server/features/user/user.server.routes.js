'use strict';
const userCtrl = require('./user.server.controller');

module.exports = app => {

  app.route('/api/v1/user/:id')
    .get(userCtrl.getUser)
    .put(userCtrl.sendInvitations);

  app.route('/api/v1/user/:id/connections')
    .get(userCtrl.getUserConnections);

  app.route('/api/v1/users')
    .get(userCtrl.getAllUsers);

  app.route('/api/v1/user/:id/address')
    .put(userCtrl.updateUserAddress);
};