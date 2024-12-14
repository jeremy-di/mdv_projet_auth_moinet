const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Jérémy : Ce fichier configure la collection User de la base de données MONGO
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
},
  password: {
    type: String,
    required: true
},
  twoFactorSecret: {
    type: String
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: true
  },
});

// Ce code permet d'enregistrer un mot de passe entrer en clair en le hachant afin qu'il ne soit pas en clair dans la bdd
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
