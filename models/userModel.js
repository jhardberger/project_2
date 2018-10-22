const mongoose 	= require('mongoose');
const Shelf 	= require('./shelfModel.js');

const userSchema = new mongoose.Schema({
	user: 		{type: String, required: true},
	password: 	{type: String, required: true},
	genres: 	[type: String],
	bio: 		{type: String},
	albums: 	[type: String],
	shelves: 	[Shelf.schema],
	notes: 		[Note.schema],
	spinning: 	{type: mongoose.Schema.Types.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('User', userSchema);