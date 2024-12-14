const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const userRoutes = require('./routes/user.routes');
const blogRoutes = require('./routes/blog.routes')
const db = require('./db/db')
const cors = require('cors')

const app = express();

// Jérémy : Ici est importé la configuration de ma bdd
db()

// Jérémy : (Cross-Origin Resource Sharing) est un système qui permet à une application web qui ne serait pas sur le même domaine à pouvoir consommer une api. Sans Cors le navigateur eb coté front bloquera la connexion et génèrera une erreur
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}));

// Jérémy : Voici la configuration de la session sur mon api
app.use(bodyParser.json());
app.use(session({
  store : new FileStore(),
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true,
}));

// Jérémy : Voici les 2 routes principales de mon api
app.use('/auth', userRoutes);
app.use('/blogs', blogRoutes);

// Jérémy : C'est ici que sera écouté l'api sur un port donné
app.listen(process.env.PORT, () => {
  console.log(`Le serveur écoute sur le port ${process.env.PORT}`);
});
