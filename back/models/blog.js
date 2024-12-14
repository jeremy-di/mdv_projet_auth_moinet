const mongoose = require('mongoose');

// Jérémy : Voici le modèle qui sera utiliser afin de configurer la collection Blogs de la base de données MONGO
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
},
  content: {
    type: String,
    required: true
},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
