const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const authControllers = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authControllers.signup,
);

router.post('/login', authControllers.login);
router.get('/status', isAuth, authControllers.getStatus);
router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authControllers.updateUserStatus,
);
module.exports = router;
