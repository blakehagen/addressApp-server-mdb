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
  getAllUsers: function (req, res) {
    // TODO add middleware to check for verified user via authToken //
    User.find().select('firstName lastName').exec(function (err, users) {
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

    let senderId = req.params.id;
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

    // SEND BACK USER THAT SENT INVITES //
    User.findById(req.params.id).exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(user);
    });
  }


};