const express = require('express'); // Importe le module Express pour la création du serveur web.
const session = require('express-session'); // Importe le module Express Session pour la gestion des sessions.
const { engine } = require('express-handlebars'); // Importe le moteur de templates Handlebars pour Express.
const port = 3010; // Port sur lequel le serveur écoutera.
const app = express(); // Crée une instance d'Express pour configurer le serveur.
app.use(express.static('public'));

// Configuration de la gestion des sessions avec un secret, évitant la sauvegarde inutile des sessions.
app.use(session({ 
  secret: 'notre-clef-secret-vraiment-tres-secret : p2jFWH2ocStauyNkg07G4i38jPcJX490COSvhuCejH9flZvbbt7wSUxSUHZCDEIdJStwhWrUnH9A0l2Rn0nKe3M6w5wWRHB7LGkK',
  resave: false,
  saveUninitialized: true,
}));

// Configuration du moteur de templates Handlebars pour Express.
app.engine('handlebars', engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

// Middleware pour analyser le corps des requêtes avec des données URL encodées.
app.use(express.urlencoded({ extended: true }));

// Utilisez les routes d'authentification
const authRoutes = require('./routers/authRoutes.js'); 
app.use('/', authRoutes); 

// Utilisez les routes de groupe
const groupeRoutesvar = require('./routers/groupeRoutes.js'); 
app.use('/', groupeRoutesvar);

// Utilisez les routes de rappel
const remindsRoutes = require('./routers/remindsRoutes.js'); 
app.use('/', remindsRoutes);

// Utilisez les routes de dashboard
const dashboardRoutes = require('./routers/dashboardRoutes.js');
app.use('/', dashboardRoutes);



// Écoute le serveur sur le port spécifié et lien vers le site
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log('Serveur en écoute sur le port 3000');
});


