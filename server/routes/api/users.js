const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const checkJwt = require('../../utils/checkJwt'); //Auth0 middleware
const auth = require('../../middleware/auth'); //Simple JWT middleware
const User = require('../../models/User');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'images',
      format: 'png',
      public_id: `avatar_${req.params.id}`,
      eager: [
        {
          crop: 'pad',
          width: 500,
          height: 500,
        },
      ],
    };
  },
});
const profileImageUploader = multer({ storage: profileImageStorage });

/*
Route  - POST /api/users
Desc   - Register new user
*/
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
    check('handle')
      .not()
      .isEmpty()
      .withMessage('handle is required'),
    check('motto')
      .isLength({ min: 2, max: 500 })
      .withMessage('motto is required (up to 500 characters)'),
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
    const { app_name, name, email, password, handle, motto } = req.body;
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
        handle: handle,
        motto: motto,
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

/*
Route  - PUT (Private) /api/users/:id
Desc   - Upload Profile image for newly created User
*/
router.put(
  '/:id',
  [auth, profileImageUploader.single('avatar')],
  async (req, res) => {
    try {
      console.log('file.path', req.file.path);
      let userID = req.params.id;
      console.log('UserID', userID);
      let user = await User.findById(userID);
      if (user) {
        user.avatar = req.file.path;
        await user.save();
        return res.json(req.file);
      } else {
        return res.status(400).json({ errors: [{ msg: 'Cannot file user' }] });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

/*
Route  - GET (Public) /api/users/:handle
Desc   - Fetch basic user details for display
*/
router.get('/:handle', async (req, res) => {
  try {
    let handle = req.params.handle;
    console.log(handle);

    let user = await User.findOne({ handle: handle });
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
