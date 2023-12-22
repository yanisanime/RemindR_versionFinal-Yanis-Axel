const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const showRegisterForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !email.includes('@')) {
        return res.render('register', { title: 'Register', error: 'Adresse e-mail invalide' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                useremail: email,
                password: hashedPassword,
            },
        });

        req.session.userId = user.id;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { title: 'Login', error: 'Identifiants ou Mot de Passe invalides' });
        }

        req.session.userId = user.userId;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur interne du serveur');
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

module.exports = {
    showRegisterForm,
    register,
    showLoginForm,
    login,
    logout,
};
