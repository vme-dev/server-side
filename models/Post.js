var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('posts',postSchema);