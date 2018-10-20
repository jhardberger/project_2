const mongoose = require('mongoose');
const linerNotes = require('./linerNotes.js');
const User = require('./userModel.js');


const albumSchema = new mongoose.Schema({
	title: {type: String, required: true},
	artist: {type: String, required: true},
	year: Date,
	cover: String,
	info: String,
	tracklist: [String],
	genres: [String],
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'linerNotes'}],
	liked_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	youtube: String,
	market: String
});

module.exports = mongoose.model('Album', albumSchema);