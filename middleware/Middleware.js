const { PrismaClient } = require('@prisma/client');


//Pour ne pas avoir accès à une page si on est pas connecté
const requireLogin = (req, res, next) => {

  if (!req.session.userId) {
    return res.redirect('/login');
  }

  next();
};

//Pour ne pas avoir accès à la page de login si on est déjà connecté
const checkIfLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }

  next();
};


module.exports = {
  requireLogin,
  checkIfLoggedIn,
};
