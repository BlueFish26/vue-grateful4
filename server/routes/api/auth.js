const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

/*
Route:  GET api/auth
Desc:   Get Authenticated User
*/
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
/*
Route:  POST api/auth
Desc:   Authenticated user and get Token
*/
router.post(
  '/',
  [
    check('email')
      .isEmail()
      .withMessage('Please inclide valid email address'),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Email Address' }] });
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const secret = config.get('jwtSecret');
      jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
