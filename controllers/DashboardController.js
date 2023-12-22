const { getAllReminders, fetchDashboardData, isReminderExpired } = require('../controllers/getData.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const redirectToDashboard = async (req, res) => {
    try {
        // Redirige immédiatement vers la page du tableau de bord
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const showDashboard = async (req, res) => {
    try {
        // Récupère les données du tableau de bord spécifiques à l'utilisateur depuis la base de données.
        const dashboardData = await fetchDashboardData(req.session.userId);

        // Pour avoir l'ensemble des rappels liés à un utilisateur
        const reminduserData = await getAllReminders(req.session.userId);

        // Convertir la structure en tableau si ce n'est pas déjà un tableau
        const reminduser = Array.isArray(reminduserData) ? reminduserData : [reminduserData];

        // Transformation pour marquer les rappels dépassés
        const today = new Date();
        const reminduserWithStatus = reminduser.map(reminder => ({
            ...reminder,
            isDepasse: new Date(reminder.dateEcheance) < today,
        }));

        // Affiche les données du tableau de bord dans le modèle Handlebars.
        res.render('dashboard', {
            title: 'Tableau de bord',
            user: req.session.userId,
            reminduser: reminduserWithStatus,
            dashboardData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const showExpiredReminders = async (req, res) => {
    try {
        // Récupère les données du tableau de bord spécifiques à l'utilisateur depuis la base de données.
        const dashboardData = await fetchDashboardData(req.session.userId);

        // Récupérer l'état du bouton à cocher depuis la requête
        const showExpired = req.body.showExpired === 'on';

        // Récupérer tous les rappels
        const reminduserData = await getAllReminders(req.session.userId);

        // Convertir la structure en tableau si ce n'est pas un tableau
        const reminduser = Array.isArray(reminduserData) ? reminduserData : [reminduserData];

        // Transformation pour marquer les rappel dépassé
        const reminduserWithStatus = reminduser.map(reminder => ({
            ...reminder,
            isDepasse: isReminderExpired(reminder.dateEcheance),
        }));

        // Affiche les données du tableau de bord dans le modèle Handlebars.
        res.render('dashboard', {
            title: 'Tableau de bord',
            user: req.session.userId,
            reminduser: showExpired ? reminduserWithStatus : reminduserWithStatus.filter(reminder => !reminder.isDepasse),
            dashboardData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const showAllReminders = async (req, res) => {
    try {
        // Récupère les données du tableau de bord spécifiques à l'utilisateur depuis la base de données.
        const dashboardData = await fetchDashboardData(req.session.userId);

        // Pour avoir l'ensemble des rappels liés à un utilisateur
        const reminduserData = await getAllReminders(req.session.userId);

        // Convertir la structure en tableau si ce n'est pas déjà un tableau
        const reminduser = Array.isArray(reminduserData) ? reminduserData : [reminduserData];

        // Transformation pour marquer les rappels dépassés
        const today = new Date();
        const reminduserWithStatus = reminduser.map(reminder => ({
            ...reminder,
            isDepasse: new Date(reminder.dateEcheance) < today,
        }));

        // Affiche les données du tableau de bord dans le modèle Handlebars.
        res.render('dashboard', {
            title: 'Tableau de bord',
            user: req.session.userId,
            reminduser: reminduserWithStatus,
            dashboardData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

module.exports = {
    redirectToDashboard,
    showDashboard,
    showExpiredReminders,
    showAllReminders,
};
