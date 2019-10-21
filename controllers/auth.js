const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const gender = req.body.gender;
  const country = req.body.country;
  bcrypt
    .hash(password, 12)
    .then(hasedPw => {
      const user = new User({
        email: email,
        password: hasedPw,
        username: username,
        gender: gender,
        country
      });
      return user.save();
    })
    .then(result =>
      res.status(201).json({
        message: 'User created!'
      })
    )
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //   console.log(req.body);
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      console.log(user);
      if (!user) {
        const error = new Error('A user with this email could not be found!');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      console.log(isEqual);
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.statusCode = 401;
        throw error;
      }
      console.log(loadedUser.email);
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        'secrettoken',
        { expiresIn: '1h' }
      );

      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
        username: loadedUser.username,
        gender: loadedUser.gender,
        country: loadedUser.country,
        email: loadedUser.email
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
