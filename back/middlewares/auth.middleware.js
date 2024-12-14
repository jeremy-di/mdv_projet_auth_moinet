const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Jérémy : Ce middleware permet de bloquer certaines routes lorsqu'il est utiliser dans les fichiers "routes"
module.exports = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ error: 'Invalid token' });
  }
};
