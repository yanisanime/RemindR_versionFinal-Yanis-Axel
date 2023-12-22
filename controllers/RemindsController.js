const app = require('express').Router();
const { PrismaClient } = require('@prisma/client'); // Importe le client Prisma pour interagir avec la base de données.
const prisma = new PrismaClient(); // Initialise le client Prisma.
const { requireLogin } = require('../middleware/Middleware.js');
const { fetchDashboardData} = require('../controllers/getData.js');


const showEditReminderForm = async (req, res) => {
    try {
        const dashboardData = await fetchDashboardData(req.session.userId);

        const { rappelleId } = req.params;
        const groupename = req.params.groupename;

        // Récupérez le rappel à modifier
        const rappelle = await prisma.rappelle.findUnique({
            where: {
                rappelleId: parseInt(rappelleId),
            },
        });

        res.render('editReminder', {
            title: 'Modification des rappels',
            user: req.session.userId,
            dashboardData,
            rappelle,
            groupename
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération du rappel pour modification");
    }
};

const editReminderProcess = async (req, res) => {
    try {
        const { rappelleId } = req.params;
        const groupename = req.params.groupename;
        const { remindname, description, deadline, color } = req.body;

        // Mettez à jour le rappel avec les nouvelles valeurs
        await prisma.rappelle.update({
            where: {
                rappelleId: parseInt(rappelleId),
            },
            data: {
                rappellename: remindname,
                description: description,
                couleur: color,
                dateEcheance: new Date(deadline),
            },
        });

        res.redirect(`/mesgroupes/${groupename}/members`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la modification du rappel");
    }
};

const createReminder = async (req, res) => {
    try {
        const groupename = req.params.groupename;
        const { remindname, description, deadline, color } = req.body;
        // Ajouter le rappel au groupe
        await prisma.rappelle.create({
            data: {
                rappellename: remindname,
                description: description,
                couleur: color,
                dateEcheance: new Date(deadline),
                creatorID: req.session.userId,
                groupeParentName: groupename,
            },
        });

        // Rediriger vers la page des membres du groupe
        res.redirect(`/mesgroupes/${groupename}/members`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const deleteReminder = async (req, res) => {
    try {
        const { rappelleId } = req.params;
        const groupename = req.body.groupename;  // Utilisez req.body pour récupérer la valeur du champ caché

        // Effectuez la suppression du rappel avec Prisma
        await prisma.rappelle.delete({
            where: {
                rappelleId: parseInt(rappelleId),
            },
        });
        // Redirigez l'utilisateur vers la page de liste des rappels
        res.redirect(`/mesgroupes/${groupename}/members`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression du rappel");
    }
};

module.exports = {
    showEditReminderForm,
    editReminderProcess,
    createReminder,
    deleteReminder,
};
