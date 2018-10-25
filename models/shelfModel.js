const mongoose 	= require('mongoose');
const Album 	= require('../models/albumModel');
const User 		= require('../models/userModel');

const shelfSchema = new mongoose.Schema({
	title: 		{type: String, required: true},
	created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	albums: 	[Album.schema],
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	updated: 	{type: Date, default: Date.now}
});

module.exports = mongoose.model('Shelf', shelfSchema);