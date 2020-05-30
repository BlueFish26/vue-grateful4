const express = require('express');
const checkJwt = require('../../utils/checkJwt');
const config = require('config');
const auth = require('../../middleware/auth'); //Simple JWT middleware
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const postImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'posts',
      format: 'png',
      public_id: `post_${req.params.id}`,
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
const postImageUploader = multer({ storage: postImageStorage });

router.post(
  '/',
  [
    auth,
    check('app_name')
      .not()
      .isEmpty()
      .withMessage('app_name is required'),
    check('email')
      .isEmail()
      .withMessage('email is required'),
    check('text')
      .not()
      .isEmpty()
      .withMessage('text is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { app_name, email, text } = req.body;
    const newPost = new Post({
      app_name,
      email,
      text,
    });
    newPost.save((err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
    });
    return res.json(newPost);
  }
);

router.post(
  '/comment/:id',
  [
    auth,
    check('text')
      .not()
      .isEmpty()
      .withMessage('text is required'),
    check('email')
      .isEmail()
      .withMessage('email is required'),
    check('name')
      .not()
      .isEmpty()
      .withMessage('name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        email: req.body.email,
        name: req.body.name,
      };
      post.comments.unshift(newComment);
      post.save((err) => {
        if (err) {
          return res.status(500).send(err.message);
        }
      });
      return res.json(newComment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

router.get('/app/:app_name', [auth], async (req, res) => {
  try {
    const posts = await Post.find({ app_name: req.params.app_name })
      .select('-comments')
      .sort({
        date: -1,
      });
    return res.json(posts);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    //const result = global.predictor.predict('great');
    //console.log(result.score);
    const post = await Post.findById(req.params.id).select('-comments');
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});
router.get('/comments/:post_id', async (req, res) => {
  try {
    const comments = await Post.findById(req.params.post_id)
      .select('comments')
      .sort({ date: -1 });
    return res.json(comments);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
