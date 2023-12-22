const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireLogin } = require('../middleware/Middleware.js');
const RemindsController = require('../controllers/RemindsController.js');
const router = express.Router();
const prisma = new PrismaClient();

// Route pour afficher le formulaire de modification
router.get('/mesgroupes/:groupename/edit-reminder/:rappelleId', requireLogin, RemindsController.showEditReminderForm);

// Route pour traiter la soumission du formulaire de modification
router.post('/mesgroupes/:groupename/edit-reminder_process/:rappelleId', requireLogin, RemindsController.editReminderProcess);

// Route pour ajouter des Rappels à un groupe
router.post('/mesgroupes/:groupename/createreminder', requireLogin, RemindsController.createReminder);

// Route pour supprimer un rappel d'un groupe
router.post('/mesgroupes/:groupename/delete-reminder/:rappelleId', requireLogin, RemindsController.deleteReminder);

module.exports = router;
