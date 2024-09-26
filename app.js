//1. Invocamos a express
const express = require('express');
const app = express();

//2. Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//3. Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//4. Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//5. Configuración del CORS.
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

//6. Var. de session
const session = require('express-session');
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

//7. Invocamos al módulo de conexión del db
const connection = require('./database/db');

//8. Ruta de registro
app.post('/api/register', async (req, res) => {
    const { usuario, contrasena, email } = req.body;

    // Validar los datos recibidos
    if (!usuario || !contrasena || !email) {
        return res.status(400).json({ success: false, message: 'Todos los campos son necesarios' });
    }

    try {
        let passwordHash = await bcryptjs.hash(contrasena, 8);
        connection.query('INSERT INTO usuarios SET ?', { usuario: usuario, correo: email, contraseña: passwordHash }, (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error al registrar usuario' });
            }
            res.json({ success: true, message: 'Usuario registrado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al hashear la contraseña' });
    }
});

//9. Ruta de login
app.post('/api/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validar los datos recibidos
    if (!usuario || !contrasena) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son necesarios' });
    }

    connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error en la consulta de inicio de sesión' });
        }

        if (results.length === 0 || !(await bcryptjs.compare(contrasena, results[0].contraseña))) {
            res.json({ success: false, message: 'Usuario o contraseña incorrecta' });
        } else {
            req.session.user = results[0].usuario;
            console.log('Sesión iniciada para:', req.session.user);
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        }
    });
});
 
//10. Ruta para retornar el usuario en sesión.
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'No autorizado' });
    }
});



//11. Ruta de logout.
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.json({ success: true, message: 'Sesión cerrada correctamente' });
    });
});



app.listen(3000, () => {
    console.log('El servidor se está ejecutando en http://localhost:3000');
});
