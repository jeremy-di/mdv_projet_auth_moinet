const Blog = require('../models/blog');
const mongoose = require('mongoose');

// Jérémy : Ce contrôleurr permet de créer un blog en entrant un titre et un contenu
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      author: req.userId, // L'utilisateur connecté
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created', blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Jérémy : Ce contrôleur permet d'afficher la liste des blogs
exports.getBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().populate('author', 'username');
      res.json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Jérémy : Ce contrôleur permet de choisir un blog en particulier grace à son id en bdd, ce contrôleur marche de paire avec le contrôleur de mise à jour car c'est lui qui permet d'afficher en front les infos dans le formulaire de mise à jour
exports.getOneBlog = async (req, res) => {
  try {
      const blogId = req.params.id;
      console.log("Received ID:", req.params.id);


      // Vérifiez si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
          return res.status(400).json({ status: 400, msg: "Invalid blog ID" });
      }

      const blog = await Blog.findById(blogId);

      if (!blog) {
          return res.status(404).json({ status: 404, msg: "No blog found" });
      }

      res.status(200).json({ status: 200, msg: "OK", result: blog });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ status: 500, msg: "Server error" });
    }
};

// Jérémy : Ce contrôleur permet de modifier ce qui se trouve dans un blog
exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBlog = req.body

    const blog = await Blog.findById(id)
    if ( !blog ) {
        return res.status(404).json({status : 404, msg : "Blog not found"})
    }
    
    Object.assign(blog, updatedBlog)
    const updateBlog = await blog.save()
    res.status(200).json({status : 200, msg : "Blog updated", result : updateBlog})
  } catch (error) {
      console.error("Erreur lors de la mise à jour du blog : ", error)
      res.status(500).json({status : 500, msg : "Erreur lors de la mise à jour du blog"})
  }
};

// Jérémy : Ce contrôleur permet de supprimer un blog
exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findByIdAndDelete(blogId);
    console.log(blog, req.userId);
    
    if (!blog || blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
  
  
