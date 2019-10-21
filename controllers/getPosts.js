const Post = require('../models/post');
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(data => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch(err => console.log(err));
};
