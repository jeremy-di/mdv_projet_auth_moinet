const express = require('express');
const { register, generate2FA, verify2FA, login, verifyLogin2FA } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Même chose que pour les blogs
router.post('/register', register);
router.post('/login', login);
router.post('/login-2fa', verifyLogin2FA);

router.post('/2fa/setup', generate2FA);
router.post('/2fa/verify', verify2FA);



module.exports = router;
