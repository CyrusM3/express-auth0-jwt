const express = require('express');
const indexRouter = require('./routes/router.js');
const path = require('path');
const { auth } = require('express-openid-connect');
require('dotenv').config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
  clientSecret: process.env.CLIENTSECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'http://localhost:5000',
    scope: 'openid profile email',
  },
};

// define express app
const app = express();
app.set('views', 'views');
app.set('view engine', 'ejs');

// Middleware handler: for sending json to server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load static assets
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use('/', indexRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
