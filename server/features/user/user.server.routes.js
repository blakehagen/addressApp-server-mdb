'use strict';
const userCtrl = require('./user.server.controller');
const middleware = require('../../middlware/middleware');

module.exports = app => {

  app.route('/api/v1/user/:id')
    .get(middleware.isAuthenticated, userCtrl.getUser)
    .put(middleware.isAuthenticated, userCtrl.sendInvitations);

  app.route('/api/v1/user/:id/connections')
    .get(middleware.isAuthenticated, userCtrl.getUserConnections)
    .put(middleware.isAuthenticated, userCtrl.saveNewConnections);

  app.route('/api/v1/users')
    .get(middleware.isAuthenticated, userCtrl.getAllUsers);

  app.route('/api/v1/user/:id/address')
    .put(middleware.isAuthenticated, userCtrl.updateUserAddress);

  app.route('/api/v1/user/:id/coordinates')
    .put(middleware.isAuthenticated, userCtrl.getCoordinates);

  app.route('/api/v1/user/:id/remove/:inviteId')
    .put(middleware.isAuthenticated, userCtrl.removeRequest);
};