const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const VideoSchema = new Schema({
  youtubeId: String,
  dateCreated: Date,
  dateEdited: Date,
  videoPath: String,
  audioPath: String,
  length: Number,
  origAuthor: String,
  videoCompleted: Boolean,
  audioCompleted: Boolean,
  inProgress: Boolean,
  title:String,
  description: String,
  thumbnails: Array,
});


module.exports = mongoose.model('Video', VideoSchema);
