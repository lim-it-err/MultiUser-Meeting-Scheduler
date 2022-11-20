const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  res.render("login.html");
});

module.exports = router;