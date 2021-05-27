const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now() },
  text: { type: String, required: true },
  published: { type: Boolean, default: false },
});

PostSchema.virtual('url').get(function () {
  return '/posts' + this._id;
});

module.exports = mongoose.model('Posts', PostSchema);
