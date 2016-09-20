const mongoose = require('mongoose');
var mongoURI   = 'mongodb://sb:sb@ds035766.mlab.com:35766/snailbox';

module.exports = () => {
  mongoose.connect(mongoURI);
  mongoose.connection.once('open', () => {
    console.log('Connected to mongoDB at', mongoURI);
  })
};