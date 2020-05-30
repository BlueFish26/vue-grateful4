const express = require('express');
const router = express.Router();
const checkJwt = require('../../utils/checkJwt'); //Auth0 middleware
const auth = require('../../middleware/auth'); //Simple JWT middleware
const config = require('config');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const User = require('../../models/User');

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
/*
Route  - POST /api/posts
Desc   - Create a new Post
*/
router.post(
  '/',
  [
    auth,
    check('text')
      .not()
      .isEmpty()
      .withMessage('text is required'),
  ],
  async (req, res) => {
    const { text } = req.body;
    const errors = validationResult(req);
    const commentPositivity = global.predictor.predict(text);
    console.log(commentPositivity);
    if (commentPositivity.score < 0.7) {
      return res
        .status(400)
        .json({
          errors: [
            { msg: "'Please enter a more positive comment, thank you.'" },
          ],
        });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.user.id).select('-password');
    const email = user.email;
    const app_name = 'grateful4';
    const newPost = new Post({
      app_name,
      email,
      text,
    });
    newPost.save((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }
    });
    return res.json(newPost);
  }
);

/*
Route  - PUT /api/posts/:id
Desc   - Upload image for Post
*/
router.put(
  '/:id',
  [auth, postImageUploader.single('media')],
  async (req, res) => {
    try {
      console.log('file.path', req.file.path);
      let userID = req.user.id;
      console.log('UserID', userID);
      let post = await Post.findById(req.params.id);
      if (post) {
        post.media = req.file.path;
        await post.save();
        return res.json(req.file);
      } else {
        return res.status(400).json({ errors: [{ msg: 'Cannot file Post' }] });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

/*
Route   - GET /api/posts
Desc    - Get Posts by User
*/
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = await Post.find({ email: user.email }).select('-comments');
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

/*
Route  - POST /api/posts/comment/:id
Desc   - Add a comment to a Post
*/
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

/*
Route  - GET /api/posts/app/:app_name
Desc   - Retrieve Posts based on App_name 
 */
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

/*
Route  - GET /api/posts/:id
Desc   - Retrieve a Post
*/
router.get('/:id', async (req, res) => {
  try {
    //console.log(result.score);
    const post = await Post.findById(req.params.id).select('-comments');
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

/*
Route  - GET /api/posts/comment/:id
Desc   - Retrieve a Comments by Post
*/
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
