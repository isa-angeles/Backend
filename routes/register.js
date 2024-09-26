const express = require('express');
const bcryptjs = require('bcryptjs');
const connection = require('../database/db');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { usuario, contrasena, email } = req.body;

    if (!usuario || !contrasena || !email) {
        return res.status(400).json({ success: false, message: 'Todos los campos son necesarios' });
    }

    try {
        let passwordHash = await bcryptjs.hash(contrasena, 8);
        connection.query('INSERT INTO usuarios SET ?', { usuario, correo: email, contraseña: passwordHash }, (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error al registrar usuario' });
            }
            res.json({ success: true, message: 'Usuario registrado correctamente' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al hashear la contraseña' });
    }
});

module.exports = router;
