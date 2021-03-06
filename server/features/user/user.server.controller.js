'use strict';
const _    = require('lodash');
const rp   = require('request-promise');
const User = require('./user.server.model');

module.exports = {

  // GET ONE USER BY ID //
  getUser: (req, res) => {

    User.findById(req.params.id).select('-password -userCreated -userCreated_readable').exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(user);
    })
  },

  // GET ALL USERS FOR SEARCH
  getAllUsers: (req, res) => {
    User.find().select('firstName lastName pendingInvitationsSent pendingInvitationsReceived connections').exec((err, users) => {
      if (err) {
        return res.status(500);
      }
      return res.status(200).json(users)
    })
  },

  // UPDATE USER ADDRESS //
  updateUserAddress: (req, res) => {
    User.findByIdAndUpdate(req.params.id, {$set: {'address': req.body}}, {new: true}, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send('Update Success!');
    })
  },

  // SAVE INVITES TO SENDER AND SENDEES //
  sendInvitations: (req, res) => {
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
    User.findById(req.params.id).select('pendingInvitationsSent pendingInvitationsReceived connections').populate('pendingInvitationsSent', 'firstName lastName email').populate('pendingInvitationsReceived', 'firstName lastName email').populate('connections', 'firstName lastName email address').exec((error, user) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(user);
    })
  },

  saveNewConnections: (req, res) => {
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
  },

  getCoordinates: (req, res) => {
    let address        = req.body;
    let addressString  = `${address.address1} ${address.city}, ${address.state} ${address.postal_code}`;
    let encodedAddress = encodeURI(addressString);

    let geocodeKey = '&key=AIzaSyA2hB-NTFBYZag4BrGrpnANlH-OUbrJIQM';
    let baseUrl    = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

    let options = {
      uri: `${baseUrl}${encodedAddress}${geocodeKey}`,
      json: true
    };

    rp(options)
      .then((mapData) => {

        if (!_.isEmpty(mapData.results) || mapData.status === 'ZERO_RESULTS') {
          return res.status(200).send('Coordinates Not Found!');
        }

        let coordinates = {
          latitude: _.get(mapData.results[0], 'geometry.location.lat', null),
          longitude: _.get(mapData.results[0], 'geometry.location.lng', null)
        };

        User.findByIdAndUpdate(req.params.id, {$set: {'coordinates': coordinates}}, {new: true}, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send('Coordinates Saved!');
        })
      })
      .catch(function (err) {
        return res.status(500).send(err);
      });
  }

};