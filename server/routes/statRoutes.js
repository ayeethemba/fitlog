const express = require('express');
const router = express.Router();
const {getStats, getPrs} = require('../controllers/statController.js');
const requireAuth = require('../middleware/requireAuth.js');

router.use(requireAuth);

router.get('/', getStats);
router.get('/prs', getPrs);

module.exports = router;