const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require('axios');

// home route
router.get('/', (req, res) => {
  const authenticate = req.oidc.isAuthenticated();
  res.render('base', {
    title: 'Profile',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
  });
  console.log(authenticate);
});

// route for Dashboard
router.get('/dashboard', requiresAuth(), (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard Page',
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

// route for secured: trigger the end point, and call the middlewware, if the user is logged in or not
router.get('/secured', requiresAuth(), async (req, res) => {
  let data = {};
  const { token_type, access_token } = req.oidc.accessToken;
  try {
    // making API call: calling the server to get the data
    const apiResponse = await axios.get('http://localhost:5000/private', {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });
    data = apiResponse.data;
  } catch (e) {
    console.log(e);
  }
  console.log(access_token);
  // you will be redirected to the secured page with data you get from API
  res.render('secured', {
    title: 'World Class Protection ',
    isAuthenticated: req.oidc.isAuthenticated(),
    data,
  });
});

// route for create endpoint: role based
router.get('/create', requiresAuth(), async (req, res) => {
  let data = {};
  const { token_type, access_token } = req.oidc.accessToken;
  try {
    // making API call: calling the server to get the data
    const apiResponse = await axios.get('http://localhost:5000/role', {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });
    data = apiResponse.data;
  } catch (e) {
    console.log(e);
  }
  console.log(access_token);
  // view: you will be redirected to the secured page with data you get from API
  res.render('create', {
    title: 'Admin Group ',
    category: 'admin page',
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user,
    data: data,
  });
});

// route for contact
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

module.exports = router;
