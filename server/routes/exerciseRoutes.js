const express = require('express');
const router = express.Router();
const { getExercises } = require('../controllers/exerciseController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', getExercises);

module.exports = router;
