const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireLogin } = require('../middleware/Middleware.js');
const GroupeController = require('../controllers/GroupeController.js');
const router = express.Router();
const prisma = new PrismaClient();

// Route pour la page "Mes Groupes"
router.get('/mesgroupes', requireLogin, GroupeController.showMesGroupes);

// Route pour la création de groupe depuis la page "Mes Groupes"
router.post('/mesgroupes/create-group', requireLogin, GroupeController.createGroup);

// Route pour avoir une page qui montre les membres d'un groupe et permet d'en ajouter
router.get('/mesgroupes/:groupename/members', requireLogin, GroupeController.showGroupMembers);

// Route pour ajouter des membres à un groupe
router.post('/mesgroupes/:groupename/add-member', requireLogin, GroupeController.addMemberToGroup);

module.exports = router;
