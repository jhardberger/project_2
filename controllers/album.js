const express	 = require('express');
const router 	 = express.Router();
														//models
const Album   	 = require('../models/albums');
const LinerNotes = require('../models/linerNotes');
const user 		 = require('./userModel.js');
														//routes
//index
router.get('/', async (req, res, next) => {
	
	try {

	} catch(err){
		next(err)
	}
	
});

//new

router.get('/new', async (req, res, next) => {
	
	try {
		const allAlbums = await Album.find();
		res.render('albums/new.ejs', {
			albums: allAlbums
		});
	} catch(err){
		next(err)
	}
	
});

//show

router.get('/:id', async (req, res, next) => {
	
	try {
		const foundAlbum = await Album.findById(req.params.id);
		//more tk?
		res.render('albums/show.ejs', {
			album: foundAlbum,
		});
	} catch(err){
		next(err)
	}
	
});

//edit

router.get('/:id/edit', async (req, res, next) => {

	try {
	 	const foundAlbum = await Album.findById(req.params.id);
	 	res.render('albums/edit.ejs', {
	 		album: foundAlbum
	 	});
	} catch(err){
		next(err)
	}
	 
});

//post

router.post('/', async (req, res, next) => {
	
	try {
		const createdAlbum = await Album.create(req.body, () => {
			res.redirect('/albums'); 					//probably want to send this somewhere else
		});
		// const foundUser = await User.findById(req.body.userId);
		// foundUser.library.push(createdAlbum)			//NOTE: fix later/work out methodology
		//	foundUser.save(af)


	} catch(err){
		next(err)
	}
	
})

//put

router.put('/:id', async (req, res, next) => {

	try {
		const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, {new: true}, () => {
			res.redirect('/albums');		
		});
	} catch(err){
		next(err)
	}	
});

//delete

router.delete('/:id', async (req, res, next) => {

	try {
		const deletedAlbum = await Album.findByIdAndRemove(req.params.id, () => {
			res.redirect('/album')
		});
		// const foundUser = await User.findOne({'albums._id': req.params.id});
		// foundUser.albums.id(req.params.id).remove();
		// foundUser.save(af)
	} catch(err){
		next(err)
	}
		
});
														//exports
module.exports = router;


