const { checkIfLoggedIn } = require('../middleware/Middleware.js');
const AuthController = require('../controllers/AuthController.js');
const express = require('express');
const router = express.Router();

// Route pour afficher le formulaire d'inscription.
router.get('/register', checkIfLoggedIn, AuthController.showRegisterForm);

// Route pour traiter le formulaire d'inscription.
router.post('/register', checkIfLoggedIn, AuthController.register);

// Route pour afficher le formulaire de connexion.
router.get('/login', checkIfLoggedIn, AuthController.showLoginForm);

// Route pour traiter le formulaire de connexion.
router.post('/login', checkIfLoggedIn, AuthController.login);

// Route pour la déconnexion : détruit la session et redirige vers la page de connexion.
router.get('/logout', AuthController.logout);

module.exports = router;
