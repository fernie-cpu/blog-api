const Comment = require('../models/comments');
const { body, validationResult } = require('express-validator');

exports.create_comment = [
  body('name', 'you must have a name').trim().escape(),
  body('message', "message field can't be empty").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ data: req.body, errors: errors.array() });
      return;
    }

    const comment = new Comment({
      name: req.body.name,
      message: req.body.message,
      postId: req.params.postid,
    });
    comment.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: 'comment sent' });
    });
  },
];

exports.comment_get = async (req, res, next) => {
  try {
    const allComments = await Comment.find({});
    const comments = allComments.filter(
      (comment) => comment.postId === req.params.postid
    );
    if (!comments) {
      return res.status(404).json({ err: 'comments not found' });
    }
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.single_comment_get = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res
        .status(404)
        .json({ err: `comment id: ${req.params.commentid} not found` });
    }
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.update_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentid, {
      name: req.body.name,
      message: req.body.message,
    });
    if (!comment) {
      return res.status(404).json({ err: 'comment not found' });
    }
    res.status(200).json({ msg: 'comment updated!' });
  } catch (err) {
    next(err);
  }
};

exports.delete_all_comment = async (req, res, next) => {
  try {
    const comments = await Comment.deleteMany({ postId: req.params.postid });
    if (!comments) {
      return res
        .status(404)
        .json({ err: `comment id: ${req.params.id} not found` });
    }
    res.status(200).json({ msg: `comment ${req.params.id}` });
  } catch (err) {
    next(err);
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentid);
    if (!comment) {
      return res
        .status(404)
        .json({ err: `comment with id ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ msg: `comment ${req.params.id} deleted sucessfuly` });
  } catch (err) {
    next(err);
  }
};
