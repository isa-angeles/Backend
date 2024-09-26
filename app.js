const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

// Inicializar Express
const app = express();

// Configuraciones básicas
dotenv.config({ path: './env/.env' });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax' 
    }
}));

// Rutas
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/register'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/logout'));

// Servidor
app.listen(3000, () => {
    console.log('El servidor se está ejecutando en http://localhost:3000');
});
