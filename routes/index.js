const express = require('express');
const router = new express.Router();
const dates_routes = require('./dates');
const users_routes = require('./users');

router.use(dates_routes.router);
router.use(users_routes.router);

exports.router = router;
