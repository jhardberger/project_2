const express	 = require('express');
const router 	 = express.Router();
const request 	 = require('superagent');

														//models
const Album   	 = require('../models/albumModel');
const LinerNotes = require('../models/linerNoteModel');
const User 		 = require('../models/userModel');
const Shelf 	 = require('../models/shelfModel.js');

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
			albums: allAlbums,
			session: req.session
		});
	} catch(err){
		next(err)
	}	
});

//new
router.get('/new/:id', async (req, res, next) => {
	
	try {
		if (req.session.logged){
			let releaseId = req.params.id;
			const creator = await User.findOne({username: req.session.username});

			db.getRelease(releaseId, (err, data) => {
				console.log(data, 'album data------');
				res.render('albumViews/new.ejs', {
					album: data,
					session: req.session,
					shelves: creator.shelves
				});
			});
		} else {
			res.redirect('/auth/login');
		}
		
	}catch(err){
		next(err)
	}

});

//show
router.get('/:id', async (req, res, next) => {
	
	try {
		const album = await Album.findById(req.params.id);
		const allNotes = await LinerNotes.find({'album': req.params.id}).populate('author');

		console.log(`----------------allNotes-----------------------\n`, allNotes);

		//more tk?
		res.render('albumViews/show.ejs', {
			album,
			allNotes,
			session: req.session
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
	 		album: foundAlbum,
	 		session: req.session
	 	});
	} catch(err){
		next(err)
	} 
});

//post
router.post('/', async (req, res, next) => {
	
	try {
		// ---------------------------- 'CREATE' ALBUM / ADD TO SHELF ---------------------------- 

		const createdAlbum = await Album.create(req.body);						// Make the album
	    const foundShelf   = await Shelf.findById(req.body.shelf); 			// Find the Shelf
	    
	  //   if (foundShelf != null){												// If Shelf exists
		 //    foundShelf.albums.push(createdAlbum);								// Add to Shelf
			// await foundShelf.save();
	  //   };

	    if (foundShelf != null && foundShelf.length === 0){												// If Shelf exists
		    foundShelf.albums.push(createdAlbum);								// Add to Shelf
			await foundShelf.save();
	    } else {
	    	foundShelf.albums.forEach(shelfAlbum => {
	    		if (foundShelf.albums.findIndex((alb) => alb.id === createdAlbum.id) === -1){
	    			foundShelf.albums.push(createdAlbum);
	    		}
	    	});
	    };


		const creator = await User.findOne({username: req.session.username}); 	// Find User
		if (creator != null){													// If User exists
			creator.albums.push(createdAlbum);									// Add album to User albums
			await creator.save();
		}

		res.redirect('/albums'); 

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
	console.log("HEY HEY HEY HEY HEY HEY HEY HEY delete album route hit! for:" + req.params.id);
	try {
		const deletedAlbum = await Album.findByIdAndRemove(req.params.id);
		const creator = await User.findOne({username: req.session.username}); 
		creator.albums.id(req.params.id).remove();
		creator.save(() => {
			res.redirect('/albums/')
		});
	} catch(err){
		next(err)
	}		
});
														//exports
														
module.exports = router;

// ***********************************************************************
// ******************************** END **********************************
// ***********************************************************************