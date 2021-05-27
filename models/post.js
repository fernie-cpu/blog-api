const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: Date },
  published: { type: Boolean, default: false },
});

PostSchema.virtual('url').get(function () {
  return '/api/posts' + this._id;
});

module.exports = mongoose.model('Posts', PostSchema);
