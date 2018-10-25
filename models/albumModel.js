const mongoose 		= require('mongoose');
const LinerNote 	= require('../models/linerNoteModel');
const User 			= require('../models/userModel');


const albumSchema = new mongoose.Schema({
	title: 		{type: String, required: true},
	artist: 	{type: String, required: true},
	year: 		Date,
	cover: 		String,
	info: 		String,
	tracklist: 	[String],
	genres: 	[String],
	liner_notes: [LinerNote.schema],
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	youtube: 	String,
	market: 	String
});

module.exports = mongoose.model('Album', albumSchema);