var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VideoSchema = new Schema({
	youtubeId:String,
	dateCreated:Date,
	dateEdited:Date,
	videoPath:String,
	audioPath:String,
	length:Number,
	origAuthor:String,
	videoCompleted: Boolean,
	audioCompleted: Boolean,
	inProgress: Boolean,
	title:String,
	description:String,
	thumbnails: Array
});


module.exports = mongoose.model('Video', VideoSchema);