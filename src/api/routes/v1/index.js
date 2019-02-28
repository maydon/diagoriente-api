const express = require('express');
const path = require('path');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const themeRoutes = require('./theme.route');
const interestRoutes = require('./interest.route');
const familyRoutes = require('./family.route');
const activityRoutes = require('./activity.route');
const jobRoutes = require('./job.route');
const formationRoutes = require('./formation.route');
const competenceRoutes = require('./competence.route');
const skillRoutes = require('./skill.route');
const parcourRoutes = require('./parcour.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */

router.use('/docs', express.static(path.join(__dirname, '../../../../docs')));
router.use('/icons', express.static(path.join(__dirname, '../../../uploads')));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/themes', themeRoutes);
router.use('/interests', interestRoutes);
router.use('/families', familyRoutes);
router.use('/activities', activityRoutes);
router.use('/jobs', jobRoutes);
router.use('/formations', formationRoutes);
router.use('/competences', competenceRoutes);
router.use('/skills', skillRoutes);
router.use('/parcours', parcourRoutes);

module.exports = router;
