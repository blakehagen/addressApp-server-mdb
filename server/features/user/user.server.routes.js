'use strict';
const userCtrl = require('./user.server.controller');

module.exports = app => {

  app.route('/api/v1/user/:id')
    .get(userCtrl.getUser)
    .put(userCtrl.sendInvitations);

  app.route('/api/v1/user/:id/connections')
    .get(userCtrl.getUserConnections)
    .put(userCtrl.saveNewConnections);

  app.route('/api/v1/users')
    .get(userCtrl.getAllUsers);

  app.route('/api/v1/user/:id/address')
    .put(userCtrl.updateUserAddress);

  app.route('/api/v1/user/:id/coordinates')
    .put(userCtrl.getCoordinates);

  app.route('/api/v1/user/:id/remove/:inviteId')
    .put(userCtrl.removeRequest);
};