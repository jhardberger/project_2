const mongoose 	= require('mongoose');
const Album 	= require('../models/albumModel');
const User 		= require('../models/userModel');

const linerNoteSchema = new mongoose.Schema({
	author: 	{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	note: 		{type: String, required: true},
	date: 		{type: Date, default: Date.now},
	album: 		{type: mongoose.Schema.Types.ObjectId, ref: 'Album'},
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('LinerNote', linerNoteSchema);
