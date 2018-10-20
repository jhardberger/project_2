const mongoose = require('mongoose');
const Album = require('./albumModel.js');

const shelfSchema = new mongoose.Schema({
	createdBy: 	{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	title: 		{type: String, required: true},
	albums: 	{type: mongoose.Schema.Types.ObjectId, ref: 'Album'},
	updated: 	Date, 
	liked_by: 	[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Shelf', shelfSchema);