const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  console.log(req.file);
  const username = req.body.username;
  const caption = req.body.caption;
  const duration = req.body.duration;
  const tips = req.body.tips;
  const location = req.body.location;
  const image = req.file.path;

  if (req.file) {
    const post = new Post({
      username: username,
      caption,
      duration,
      tips,
      location,
      image
    });
    post.save();
    res.status(201).json({ message: 'image is successfully saved!' });
  } else {
    throw 'error';
  }
};
