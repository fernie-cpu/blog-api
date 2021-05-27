const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date },
});

module.exports = mongoose.model('Comments', CommentsSchema);
