/**
 * This application is made sue every call is secured.. how can we make it secured?
 * To make sure every call has a valid token.
 * in this app we will check if the token is valid.
 * after verification, we will give access to the user.
 */
const express = require('express');
const app = express();
const { expressjwt: jwt } = require('express-jwt');
var jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-bxvzp7li45kue6o0.us.auth0.com/.well-known/jwks.json',
  }),
  requestProperty: 'user',
  audience: 'http://localhost:5000',
  issuer: 'https://dev-bxvzp7li45kue6o0.us.auth0.com/',
  algorithms: ['RS256'],
});

const checkPermission = jwtAuthz(['read:messages'], {
  customScopeKey: 'permissions',
});

console.log('CheckPermission: ', jwtCheck);

// make a call and send some response
app.get('/public', (req, res) => {
  res.json({
    type: 'public',
  });
});

// middleware: check in if the request has a token.
// app.use(jwtCheck);
/**since we passeed 'jwtCheck in the 'private' end-point we can ignore 'app.use(jwtCheck);' */

// jwt middleware: check in if the request has a token.
app.get('/private', jwtCheck, (req, res) => {
  res.json({
    type: 'private',
  });
});

// jwt middleware: check if the use loggedin or not and check if the user is admin or not & if the request has a token.
app.get('/role', jwtCheck, checkPermission, (req, res) => {
  res.json({
    type: 'authentication success',
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
