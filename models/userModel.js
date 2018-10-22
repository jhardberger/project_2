const mongoose 	= require('mongoose');
const Shelf 	= require('../models/shelfModel');
const Album 	= require('../models/albumModel');
const LinerNote = require('../models/linerNoteModel');

const userSchema = new mongoose.Schema({
	username: 	{type: String, required: true},
	password: 	{type: String, required: true},
	genres: 	[{type: String}],
	bio: 		{type: String},
	albums: 	[{type: String}],
	shelves: 	[Shelf.schema],
	linerNotes: [LinerNote.schema],
	// spinning: 	{type: mongoose.Schema.Types.ObjectId, ref: 'Album'}

});

module.exports = mongoose.model('User', userSchema);