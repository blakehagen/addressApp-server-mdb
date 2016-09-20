'use strict';

// APP //
const babel       = require('babel-core').transform('code');
const express     = require('./server/config/express.js');
const environment = process.env.NODE_ENV;

// RUN EXPRESS //
const app = express();

// // // ROUTES // // //
// AUTH ROUTES //
require('./server/features/auth/auth.routes')(app);
// USER ROUTES //
require('./server/features/user/user.server.routes')(app);
// ADDRESS ROUTES //
require('./server/features/address/address.server.routes')(app);

// TEST ROUTE //
app.get('/api/v1/test', (req, res) => {
  res.status(200).send('Light \'em up! We good to go!');
});

// // // PORT // // //
const port = process.env.PORT || 4800;
app.listen(port, () => {
  console.log('Check me out on port', port);
});