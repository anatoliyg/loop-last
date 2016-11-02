var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ForkedBearSchema = new Schema({
    forkedFromFork: Boolean,
    forkedFromForkId: String,
    forkedByUserId: String,
	dateCreated:Date,
    segments: Array
});


module.exports = mongoose.model('ForkedBear', ForkedBearSchema);