const mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
	url : {
		type: String
	},
	shortCode : {
		type: String
	},
	hits : {
		type: Number,
		default : 0
	}
});

module.exports = mongoose.model('Url', urlSchema);