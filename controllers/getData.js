const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');
const { parse } = require('date-fns');


//Pour avoir les données à afficher notament dans le header et le footer. Mais aussi pour aoiv des donné sur un utilisateur dont ses rappeles
const fetchDashboardData = async (ID) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: ID,
      },
      include: {
        rappelle: true, // Inclure tous les rappels liés à cet utilisateur
        
      },
    });

    if (user) {
      return user; // Retourne les rappels liés à l'utilisateur
    }

    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//sert à avoir la liste des rappelles pour un utilisateur dans toute les groupe
const getAllReminders = async (ID) => {
  try {
    // Récupérer la liste des groupes de l'utilisateur
    const userGroups = await prisma.userGroup.findMany({
      where: {
        userID: ID,
      },
      include: {
        groupe: true,
      },
    });

    // Extraire les noms des groupes auxquels l'utilisateur appartient
    const groupNames = userGroups.map((userGroup) => userGroup.groupe.groupename);
    // Récupérer les rappels dans les groupes de l'utilisateur
    const userReminders = await prisma.rappelle.findMany({
      where: {
        groupeParentName: {
          in: groupNames,
        },
      },
      orderBy: {
        dateEcheance: 'asc', // Tri par date d'échéance croissante
      },
    });


    if (userReminders) {
      // Formater la date pour chaque rappel
      const formattedReminders = userReminders.map((reminder) => {
        return {
          ...reminder,
          dateEcheance: format(new Date(reminder.dateEcheance), 'dd/MM/yyyy HH:mm:ss', { locale: fr }),
        };
      });

      return formattedReminders;
    }

    return null;
  }
  catch (error) {
  console.error(error);
  throw error;
  }
};

//servira a avoir la liste de toute les rapelle spécifque à un groupe
const getAllRemindersForOneGroupe = async ( LegroupeName) => {
  try {

      // L'utilisateur appartient au groupe, récupérer les rappels du groupe
      const groupReminders = await prisma.rappelle.findMany({
        where: {
          groupeParentName: LegroupeName,
        },
        orderBy: {
          dateEcheance: 'asc', // Tri par date d'échéance croissante
        },
      });

     if (groupReminders) {
      // Formater la date pour chaque rappel
      const formattedReminders = groupReminders.map((reminder) => {
        return {
          ...reminder,
          dateEcheance: format(new Date(reminder.dateEcheance), 'dd/MM/yyyy HH:mm:ss', { locale: fr }),
        };
      });

      return formattedReminders;
    }

    return null; 
  }
  catch (error) {
  console.error(error);
  throw error;
  }
};  

//pour savoir si un rappel est dépassé
const isReminderExpired = (dateString) => {
  const today = new Date();
  const reminderDate = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());
  return reminderDate < today;
};

module.exports = {
    getAllReminders,
    getAllRemindersForOneGroupe,
    fetchDashboardData,
    isReminderExpired,
  };
  