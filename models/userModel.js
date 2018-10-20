const mongoose = require('mongoose');
const Shelf = require('./models/shelfModel');
const Album = require('./models/albums');

const userSchema = new mongoose.Schema({
	user: 		{type: String, required: true},
	password: 	{type: String, required: true},
	genres: 	[type: String],
	bio: 		{type: String},
	albums: 	[type: String],
	shelves: 	[Shelf.schema],
	notes: 		[Note.schema],
	spinning: 	{type: mongoose.Schema.Types.ObjectId, ref: 'Albums'}
});

module.exports = mongoose.model('User', userSchema);