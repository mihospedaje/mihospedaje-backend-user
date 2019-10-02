'use strict';

const express = require('express');
const router = express.Router();
const healthcheck = require('../controllers/v1/healthcheck');
const { wrapper } = require('../middleware/error');

router.get('/health-check', wrapper(healthcheck.ok));
module.exports = router;