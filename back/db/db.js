const { connect } = require('mongoose');

// Jérémy : Ce fichier permet de mettre en place la configuration et la mise en relation de l'api avec la base de données MONGO
function dbConnexion() {
    connect(process.env.MONGO_URL)
        .then(() => console.log("Connexion à la base de données établie"))
        .catch((error) => {console.log(error)})
}

module.exports = dbConnexion