const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

router.get('/', (req, res) => {
  res.json('test');
});

router.post(
  '/',
  [
    check('app_name')
      .not()
      .isEmpty()
      .withMessage('app_name is required'),
    check('name')
      .not()
      .isEmpty()
      .withMessage('name is required'),
    check('email')
      .isEmail()
      .withMessage('email is required'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('email is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { app_name, name, email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //TODO: Handle avatar image upload to Cloudinary
      let avatar = '';
      user = new User({
        app_name: app_name,
        name: name,
        email: email,
        avatar: avatar,
        password: password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
