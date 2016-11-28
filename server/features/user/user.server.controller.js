'use strict';
const _    = require('lodash');
const User = require('./user.server.model');

module.exports = {

  // GET ONE USER BY ID //
  getUser: (req, res) => {

    // TODO add middleware to check for verified user via authToken //
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized');
    }

    User.findById(req.params.id).select('-password -userCreated -userCreated_readable').exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(user);
    })
  },

  // GET ALL USERS FOR SEARCH
  getAllUsers: (req, res) => {
    // TODO add middleware to check for verified user via authToken //
    User.find().select('firstName lastName pendingInvitationsSent pendingInvitationsReceived connections').exec((err, users) => {
      if (err) {
        return res.status(500);
      }
      return res.status(200).json(users)
    })
  },

  // UPDATE USER ADDRESS //
  updateUserAddress: (req, res) => {
    // TODO add middleware to check for verified user via authToken //
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized');
    }

    User.findByIdAndUpdate(req.params.id, {$set: {'address': req.body}}, {new: true}, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send('Update Success!');
    })
  },

  // SAVE INVITES TO SENDER AND SENDEES //
  sendInvitations: (req, res) => {
    // TODO add middleware to check for verified user via authToken //
    // if (!req.headers.authorization) {
    //   return res.status(401).send('Unauthorized');
    // }

    let senderId    = req.params.id;
    let invitations = req.body;

    // SAVE INVITATIONS TO SENDER //
    _.each(invitations, invite => {
      User.findByIdAndUpdate(senderId, {
        $push: {'pendingInvitationsSent': invite}
      }, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });

    // SAVE INVITATIONS TO EACH INVITEE //
    _.each(invitations, invite => {
      User.findByIdAndUpdate(invite, {
        $push: {'pendingInvitationsReceived': senderId}
      }, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });

    // SEND BACK UPDATED USER THAT SENT INVITES //
    User.findById(req.params.id).exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json('Success');
    });
  },

  // GET ALL CONNECTIONS AND PENDING CONNECTIONS FOR 1 USER //
  getUserConnections: (req, res) => {

    // TODO add middleware to check for verified user via authToken //
    // if (!req.headers.authorization) {
    //   return res.status(401).send('Unauthorized');
    // }

    User.findById(req.params.id).select('pendingInvitationsSent pendingInvitationsReceived connections').populate('pendingInvitationsSent', 'firstName lastName email').populate('pendingInvitationsReceived', 'firstName lastName email').populate('connections', 'firstName lastName email').exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(user);
    })
  },

  saveNewConnections: (req, res) => {
    // TODO add middleware to check for verified user via authToken //
    // if (!req.headers.authorization) {
    //   return res.status(401).send('Unauthorized');
    // }

    let userId         = req.params.id;
    let newConnections = req.body;

    // SAVE NEW CONNECTIONS TO USER AND REMOVE FROM PENDING //
    _.each(newConnections, connectionId => {
      User.findByIdAndUpdate(userId, {
        $push: {'connections': connectionId},
        $pull: {'pendingInvitationsReceived': connectionId}
      }, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });

    // SAVE NEW CONNECTIONS TO EACH CONNECTION AND REMOVE PENDING //
    _.each(newConnections, connectionId => {
      User.findByIdAndUpdate(connectionId, {
        $push: {'connections': userId},
        $pull: {'pendingInvitationsSent': userId}
      }, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });

    // SEND BACK SUCCESS //
    User.findById(userId).exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json('Success');
    });
  },

  removeRequest: (req, res) => {
    // TODO add middleware to check for verified user via authToken //
    // if (!req.headers.authorization) {
    //   return res.status(401).send('Unauthorized');
    // }

    let userId         = req.params.id;
    let inviteToDelete = req.params.inviteId;

    User.findByIdAndUpdate(req.params.id,
      {$pull: {'pendingInvitationsSent': inviteToDelete}}, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });

    User.findByIdAndUpdate(inviteToDelete,
      {$pull: {'pendingInvitationsReceived': userId}}, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });

    // SEND BACK SUCCESS //
    User.findById(userId).exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json('Deleted Request');
    });
  }

};