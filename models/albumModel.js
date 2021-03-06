const mongoose 		= require('mongoose');
const LinerNote 	= require('../models/linerNoteModel');
const User 			= require('../models/userModel');


const albumSchema = new mongoose.Schema({
	title: 		{type: String, required: true},
	artist: 	{type: String, required: true},
	year: 		Date,
	cover: 		{data: Buffer, contentType: String},
	info: 		String,
	tracklist: 	[String],
	genres: 	[String],
	linerNotes: [LinerNote.schema],
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('Album', albumSchema);