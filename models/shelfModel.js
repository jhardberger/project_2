const mongoose 	= require('mongoose');
const Album 	= require('../models/albumModel');
const User 		= require('../models/userModel');

const shelfSchema = new mongoose.Schema({
	title: 		{type: String, required: true},
	created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	albums: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'Album'}],
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	updated: 	Date
});

module.exports = mongoose.model('Shelf', shelfSchema);