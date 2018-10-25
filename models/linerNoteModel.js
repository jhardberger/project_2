const mongoose 	= require('mongoose');
const Album 	= require('../models/userModel');
const User 		= require('../models/userModel');

const linerNoteSchema = mongoose.Schema({
	author: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	body: {type: String, required: true},
	date: Date,
	liked_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('LinerNote', linerNoteSchema);
