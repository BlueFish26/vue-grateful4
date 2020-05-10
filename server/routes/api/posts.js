const express = require('express');
const checkJwt = require('../../utils/checkJwt');

const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');
const router = express.Router();

router.post(
  '/',
  [
    checkJwt,
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
    checkJwt,
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

router.get('/app/:app_name', [checkJwt], async (req, res) => {
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
    const result = global.predictor.predict('great');
    console.log(result.score);
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
