const express = require('express');
const router = express.Router();
const createPostController = require('../controllers/createPost');
const getPostController = require('../controllers/getPosts');

router.post('/createPost', createPostController.createPost);

router.get('/getPost', getPostController.getPosts);

module.exports = router;
