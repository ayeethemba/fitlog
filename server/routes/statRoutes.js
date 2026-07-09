const express = require('express');
const router = express.Router();
const {getStats} = require('../controllers/statController.js');
const requireAuth = require('../middleware/requireAuth.js');

router.use(requireAuth);

router.get('/', getStats);

module.exports = router;