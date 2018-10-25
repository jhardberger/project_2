const mongoose 	= require('mongoose');
const Album 	= require('../models/albumModel');
const User 		= require('../models/userModel');

const linerNotesSchema = mongoose.Schema({
	author: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	body: 		{type: String, required: true},
	date: 		{type: Date, default: Date.now},
	album: 		{type: mongoose.Schema.Types.ObjectId, ref: 'Album'},
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('linerNotes', linerNotesSchema);