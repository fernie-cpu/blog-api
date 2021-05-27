const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

exports.post_get = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    if (!posts) {
      return res.status(404).json({ err: 'posts not found' });
    }
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.create_post = [
  body('title', "title can't be empty").trim().escape(),
  body('author', "author can't be empty").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }

    const post = new Post({
      title: req.body.title,
      author: req.body.author,
      text: req.body.text,
    });
    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: 'successufully sent' });
    });
  },
];

exports.single_post_get = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ err: `post id: ${req.params.id} not found` });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.update_post = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      text: req.body.text,
    });
    if (!post) {
      res.status(404).json({ msg: 'not found' });
    }
    res.status(200).json({ msg: 'post updated' });
  } catch (err) {
    next(err);
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ err: 'not found' });
    }
    res.status(200).json({ msg: 'post deleted' });
  } catch (err) {
    next(err);
  }
};
