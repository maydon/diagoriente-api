const express = require('express');
const authRoutes = require('./auth.route');
const themeRoutes = require('./theme.route');
const interestRoutes = require('./interest.route');
const activityRoutes = require('./activity.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/auth', authRoutes);
router.use('/themes', themeRoutes);
router.use('/interests', interestRoutes);
router.use('/activities', activityRoutes);

module.exports = router;
