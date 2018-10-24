const express	 = require('express');
const router 	 = express.Router();
const request 	 = require('superagent');

														//models
const Album   	 = require('../models/albumModel');
const LinerNotes = require('../models/linerNoteModel');
const user 		 = require('../models/userModel');
														//discogs
const disconnect 	= require('disconnect');
const Discogs 		= require('disconnect').Client;
const db 			= new Discogs().database();
const token 		= 'WTTOEjBUVdyxkdXoXYknEggHNyUjHwRdnIJaokxD';

														//routes
//index
router.get('/', async (req, res, next) => {
	
	try {
		const allAlbums = await Album.find({});
		res.render('albumViews/index.ejs', {
			albums: allAlbums
		});
	} catch(err){
		next(err)
	}	
});

//new
router.get('/new/:id', async (req, res, next) => {

	let masterId = req.params.id;
	try{
		request
			.get('api.discogs.com/masters/' + masterId + '&token=' + token)
			.end((err, data) => {
				if(err){
					console.log(err);
				}

				console.log(data);
				const albumData = JSON.parse(data.text);
				console.log("---------------------------newXalbum-----------------------")
		        console.log(albumData);
		        console.log("---------------------------newXalbum-----------------------")			// res.render('albumViews/new.ejs', {
				// 	album: data
				// });
			});
	}catch(err){
		next(err)
	}

});

//show
router.get('/:id', async (req, res, next) => {
	
	try {
		const foundAlbum = await Album.findById(req.params.id);
		//more tk?
		res.render('albumViews/show.ejs', {
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
	 	res.render('albumViews/edit.ejs', {
	 		album: foundAlbum
	 	});
	} catch(err){
		next(err)
	} 
});

//post
router.post('/', async (req, res, next) => {
	
	try {
		const createdAlbum = await Album.create(req.body);
		console.log(createdAlbum);
		res.redirect('/albums'); 						//probably want to send this somewhere else
		// const foundUser = await User.findById(req.body.userId);
		// foundUser.library.push(createdAlbum)			//NOTE: fix later/work out methodology
		//	foundUser.save(af)


	} catch(err){
		next(err)
	}
});

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
			res.redirect('/albums')
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


