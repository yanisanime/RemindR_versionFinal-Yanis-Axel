const { PrismaClient } = require('@prisma/client');
const { getAllRemindersForOneGroupe, fetchDashboardData } = require('../controllers/getData.js');
const prisma = new PrismaClient();

const showMesGroupes = async (req, res) => {
    try {
        // Récupérer la liste des groupes de l'utilisateur
        const userGroups = await prisma.userGroup.findMany({
            where: {
                userID: req.session.userId,
            },
            include: {
                groupe: true,
            },
        });
        // Récupérer la liste des noms des groupes de l'utilisateur
        const userGroupNames = userGroups.map((ug) => ug.groupeName);
        // Récupérer la liste des groupes auxquels l'utilisateur appartient en tant que membre (en excluant les groupes créés par d'autres utilisateurs)
        const otherUserGroups = await prisma.userGroup.findMany({
            where: {
                groupeName: {
                    notIn: userGroupNames,
                },
            },
            include: {
                groupe: true,
            },
        });
        const dashboardData = await fetchDashboardData(req.session.userId);

        res.render('mesgroupes', {
            title: 'Mes Groupes',
            user: req.session.userId,
            userGroups,
            dashboardData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const createGroup = async (req, res) => {
    try {
        const { newGroupName } = req.body;

        // Récupérer la liste des groupes de l'utilisateur
        const userGroups = await prisma.userGroup.findMany({
            where: {
                userID: req.session.userId,
            },
            include: {
                groupe: true,
            },
        });

        // Vérifiez si le nom du groupe est unique
        const existingGroup = await prisma.group.findUnique({
            where: {
                groupename: newGroupName,
            },
        });

        const dashboardData = await fetchDashboardData(req.session.userId);

        if (existingGroup) {
            return res.render('mesgroupes',
                {
                    title: 'Mes Groupes',
                    user: req.session.userId,
                    userGroups,
                    dashboardData,
                    errorGroupeAlweadyExists: 'Ce groupe existe déjà. Veuillez mettre un autre nom.',
                });
        }
        // Créer le nouveau groupe
        await prisma.group.create({
            data: {
                groupename: newGroupName,
            },
        });
        // Ajouter l'utilisateur en tant que créateur et membre du groupe
        await prisma.userGroup.create({
            data: {
                userID: req.session.userId,
                groupeName: newGroupName,
            },
        });
        // Rediriger vers la page Mes Groupes
        res.redirect('/mesgroupes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur. Pour la création de groupe dont le nom est déjà pris.');
    }
};

const showGroupMembers = async (req, res) => {
    try {
        const groupename = req.params.groupename;

        // Récupérer la liste des membres du groupe depuis la base de données
        const groupMembers = await prisma.userGroup.findMany({
            where: {
                groupeName: groupename,
            },
            include: {
                user: true,
            },
        });
        const dashboardData = await fetchDashboardData(req.session.userId);
        const listRemindGroupe = await getAllRemindersForOneGroupe(groupename);

        res.render('groupMembers', {
            title: 'Membres du Groupe',
            user: req.session.userId,
            groupMembers,
            listRemindGroupe,
            groupename,
            dashboardData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const addMemberToGroup = async (req, res) => {
    try {
        const groupename = req.params.groupename;
        const { searchUser } = req.body;
        const listRemindGroupe = await getAllRemindersForOneGroupe(groupename); //pour afficher la liste des rappels du groupe
        // Récupérer la liste des membres du groupe depuis la base de données
        const groupMembers = await prisma.userGroup.findMany({
            where: {
                groupeName: groupename,
            },
            include: {
                user: true,
            },
        });

        // Rechercher l'utilisateur par son nom
        const userToAdd = await prisma.user.findUnique({
            where: {
                username: searchUser,
            },
        });
        const dashboardData = await fetchDashboardData(req.session.userId);

        // Vérifier si l'utilisateur existe
        if (!userToAdd) {
            return res.render('groupMembers', {
                title: 'Membres du Groupe',
                groupename,
                groupMembers,
                user: req.session.userId,
                listRemindGroupe,
                dashboardData,
                errorUserNotFound: "Cet utilisateur n'existe pas.",
            });
        }

        // Vérifier si l'utilisateur est déjà membre du groupe
        const existingMember = await prisma.userGroup.findFirst({
            where: {
                userID: userToAdd.userId,
                groupeName: groupename,
            },
        });

        if (existingMember) {
            return res.render('groupMembers', {
                title: 'Membres du Groupe',
                groupename,
                groupMembers,
                user: req.session.userId,
                listRemindGroupe,
                dashboardData,
                errorUserExists: 'Cet utilisateur est déjà membre du groupe.',
            });
        }

        // Ajouter l'utilisateur au groupe
        await prisma.userGroup.create({
            data: {
                userID: userToAdd.userId,
                groupeName: groupename,
            },
        });

        // Rediriger vers la page des membres du groupe
        res.redirect(`/mesgroupes/${groupename}/members`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

module.exports = {
    showMesGroupes,
    createGroup,
    showGroupMembers,
    addMemberToGroup,
};
