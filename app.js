const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');

// Inicializar Express
const app = express();
mysql://root:DaCKzDrsEBrgMDAVsTpusfCMIOMPclRQ@autorack.proxy.rlwy.net:29937/railway
// Configuraciones básicas
dotenv.config({ path: './env/.env' });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: process.env.URLFRONTEND || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(session({
    secret: process.env.SECRETSESSION || 'secret',
    resave: true,
    saveUninitialized: true,
    proxy: process.env.NODE_ENV === 'production',
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
    console.log('El servidor se está ejecutando en http://localhost:3000');
});
