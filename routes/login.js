const express = require('express');
const bcryptjs = require('bcryptjs');
const connection = require('../database/db');
const router = express.Router();

router.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

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
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        }
    });
});

module.exports = router;
