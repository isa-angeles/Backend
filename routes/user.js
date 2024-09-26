const express = require('express');
const router = express.Router();

router.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'No autorizado' });
    }
});

module.exports = router;
