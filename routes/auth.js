const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const User = require('../models/user');
const authController = require('../controllers/auth');

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter valid email')
      .custom((value, { req }) => {
        return User.findOne({
          email: value
        }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('username')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
