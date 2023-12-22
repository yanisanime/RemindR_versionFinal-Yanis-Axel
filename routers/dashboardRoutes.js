const express = require('express');
const { requireLogin } = require('../middleware/Middleware.js');
const DashboardController = require('../controllers/DashboardController.js');
const router = express.Router();

// Route pour la page "Tableau de bord" C'est la route de base qui renvoie tout de suite vers la page du tableau de bord
router.get('/', requireLogin, DashboardController.redirectToDashboard);

// Route pour la page "Tableau de bord"
router.get('/dashboard', requireLogin, DashboardController.showDashboard);

// Route pour la page "Tableau de bord" les rappels à échéance dépassée
router.post('/dashboard/pasTerminer', requireLogin, DashboardController.showExpiredReminders);

// Route pour la page "Tableau de bord" avec tous les rappels
router.post('/dashboard', requireLogin, DashboardController.showAllReminders);

module.exports = router;
