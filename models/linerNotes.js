const mongoose = require('mongoose');
const Album = require('./album.js');

const linerNotesSchema = mongoose.Schema({
	author: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	body: {type: String, required: true},
	date: Date,
	liked_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('linerNotes', linerNotesSchema);