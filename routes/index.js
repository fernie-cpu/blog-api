const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportSession = passport.authenticate('jwt', { session: false });

const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const commentsController = require('../controllers/commentsController');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/posts');
});

router.get('/posts', postController.post_get);

router.post('/posts', passportSession, postController.create_post);

router.get('/posts/:id', postController.single_post_get);

router.put('/posts/:id', passportSession, postController.update_post);

router.delete('/posts/:id', passportSession, postController.delete_post);

router.post('/sign-up', userController.signup);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/posts/:postid/comments', commentsController.comment_get);

router.post(
  '/posts/:postid/comments',
  passportSession,
  commentsController.create_comment
);

router.get(
  '/posts/:postid/comments/:commentid',
  commentsController.single_comment_get
);

router.put(
  '/posts/:postid/comments/:commentid',
  passportSession,
  commentsController.update_comment
);

router.delete(
  '/posts/:postid/comment',
  passportSession,
  commentsController.delete_all_comment
);

router.delete(
  '/posts/:postid/comments/:commentid',
  passportSession,
  commentsController.delete_comment
);

module.exports = router;
