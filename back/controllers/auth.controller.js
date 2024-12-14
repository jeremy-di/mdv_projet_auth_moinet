const jwt = require('jsonwebtoken');
const User = require('../models/user');
const otplib = require('otplib');
const qrcode = require('qrcode');

// Jérémy : Contrôleur qui va permettre l'inscription par email et mot de passe
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({ email, password });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Jérémy : Contrôleur qui va permettre la connexion par email et mot de passe
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '4h' });

      if (user.isTwoFactorEnabled) {
        return res.json({ token, message: '2FA required', twoFactorRequired: true });
      }
  
      console.log(token);
      
  
      req.session.token = token;
      res.json({ message: 'Logged in', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Jérémy : Contrôleur qui va générer un qr-code permettant à l'application Microsoft Authenticator de le scanner et afficher un code 2fa
exports.generate2FA = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(404).json({ error: 'User not found' });
    let secret;

    if ( user.twoFactorSecret ) {
      secret = user.twoFactorSecret
    } else {
      secret = otplib.authenticator.generateSecret();
      user.twoFactorSecret = secret;
      await user.save();
    }

    const otpauth = otplib.authenticator.keyuri(user.username, 'dharma_blogs', secret);

    const qrCode = await qrcode.toDataURL(otpauth);


    res.json({ qrCode, secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Jérémy : Ce contrôleur va permettre de traiter le code à 6 chiffres et permettre la connexion de l'utilisateur
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = otplib.authenticator.check(token, user.twoFactorSecret);
    console.log(user.twoFactorSecret, token);
    
    
    if (!isValid) return res.status(400).json({ error: 'Invalid token' });

    user.isTwoFactorEnabled = true;
    await user.save();

    res.json({ message: 'Two-factor authentication enabled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Jérémy : Ce contrôleur permet de valider le code de l'authenticator de Microsoft mais coté front j'ai cacher le formulaire celui de vérification suffit
exports.verifyLogin2FA = async (req, res) => {
  try {
    const { token, email } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isTwoFactorEnabled) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    const isValid = otplib.authenticator.check(token, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ error: 'Invalid 2FA token' });

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '4h' });
    req.session.token = jwtToken;

    res.json({ message: 'Logged in with 2FA', token: jwtToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
