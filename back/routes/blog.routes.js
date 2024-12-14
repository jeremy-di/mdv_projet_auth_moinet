const express = require('express');
const { createBlog, getBlogs, getOneBlog, updateBlog, deleteBlog } = require('../controllers/blog.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Jérémy : Voici les différentes routes secondaires de mon api concernant les blogs, je dis secondaire car sur le fichier index.js j'utilise une route principale appelée /blogs

// Jérémy : Voici le middleware qui bloque les routes ci dessous ci un token n'est pas detecté.
router.use(authMiddleware); 
router.post('/', createBlog);
router.get('/', getBlogs);
router.get('/:id', getOneBlog);
router.put('/:id', updateBlog);
router.delete('/:blogId', deleteBlog);

module.exports = router;
