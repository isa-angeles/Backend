const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('../db');

// Inicializar Express
const app = express();

// Configuraciones básicas
dotenv.config({ path: './env/.env' });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: process.env.URLFRONTEND || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Configuración de almacenamiento de sesiones en MySQL
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

app.use(session({
    secret: process.env.SECRETSESSION || 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    }
}));

// Rutas
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/register'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/logout'));

// Servidor
app.listen(process.env.PORT || 3000, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${process.env.PORT || 3000}`);
});
