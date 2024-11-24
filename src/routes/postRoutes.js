const express = require('express');
const {authorize, authenticate}= require('../middleware/authMiddleware')
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/postController');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, authorize(['admin']), createPost);
router.put('/:id', authenticate, authorize(['admin']), updatePost);
router.delete('/:id', authenticate, authorize(['admin']), deletePost);

module.exports = router;
