const express = require('express');
const path = require('path');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const themeRoutes = require('./theme.route');
const interestRoutes = require('./interest.route');
const familyRoutes = require('./family.route');
const familiesRankRoutes = require('./familiesRank.route');
const activityRoutes = require('./activity.route');
const jobRoutes = require('./job.route');
const formationRoutes = require('./formation.route');
const competenceRoutes = require('./competence.route');
const skillRoutes = require('./skill.route');
const parcourRoutes = require('./parcour.route');
const favoriteRoutes = require('./favorite.route');
const mailerRoutes = require('./mailer.route');
const questionsRoutes = require('./question.route');
const contextsRoutes = require('./context.route');
const environmentsRoutes = require('./environment.route');
const responseJobsRoutes = require('./responseJob.route');
const communeRoute = require('./commune.route');
const entrepriseRoute = require('./entreprise.route');
const groupeAdvisor = require('./groupeAdvisor.route');

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
router.use('/assets', express.static(path.join(__dirname, '../../../assets')));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/themes', themeRoutes);
router.use('/interests', interestRoutes);
router.use('/families', familyRoutes);
router.use('/familiesRank', familiesRankRoutes);
router.use('/activities', activityRoutes);
router.use('/jobs', jobRoutes);
router.use('/formations', formationRoutes);
router.use('/competences', competenceRoutes);
router.use('/skills', skillRoutes);
router.use('/parcours', parcourRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/questions', questionsRoutes);
router.use('/contexts', contextsRoutes);
router.use('/environments', environmentsRoutes);
router.use('/responseJobs', responseJobsRoutes);
router.use('/commune', communeRoute);
router.use('/entreprise', entrepriseRoute);
router.use('/groupe', groupeAdvisor);

router.use('/mailer', mailerRoutes);

module.exports = router;
