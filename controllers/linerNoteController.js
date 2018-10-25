const express	 = require('express');
const router 	 = express.Router();
														//models
const LinerNotes = require('../models/linerNoteModel');
const Album   	 = require('../models/albumModel');
const User 		 = require('../models/userModel');
														//routes
//index
router.get('/', async (req, res, next) => {

	try {
		const allNotes = await LinerNotes.find({});
		res.render('linerNotesViews/index.ejs', {
			linerNotes: allNotes,
			session: req.session
		});
	} catch(err){
		next(err)
	}	
});

//new
router.get('/new', async (req, res, next) => {

	try {
		res.render('linerNotesViews/new.ejs', {
			session: req.session
		})
	} catch(err){
		next(err)
	}
});

//show
router.get('/:id', async (req, res, next) => {

	try {
		const foundNote = await LinerNotes.findById(req.params.id);
		const foundUser = await User.findOne({'linerNotes._id': req.params.id});
		console.log(foundUser);
		console.log(foundNotes);
		res.render('linerNotesViews/show.ejs', {
			linerNote: foundNote, 
			author: foundUser,
			session: req.session
		});
	} catch(err){
		next(err)
	}
});

//edit
router.get('/:id/edit', async (req, res, next) => {

	try {
		const foundNote = await LinerNotes.findById(req.params.id);
		const allUsers 	= await User.find();
		const foundUser = await User.findOne({'linerNotes._id': req.params.id});
		
		res.render('linerNotesViews/edit.ejs', {
			linerNote: 	foundNote,
			users: 		allUsers,
			user: 		foundUser,
			session: 	req.session
		});

	} catch(err){
		next(err)
	}
});

//post
router.post('/', async (req, res, next) => {
	
	try {
		const commentedAlbum = await Album.findById(req.body.albumId);	// Find album

		const noteToCreate = {
			author: 	req.session.userId,
			note: 		req.body.note,
			album: 		req.body.album,
		}

		const createdNote 	= await LinerNotes.create(noteToCreate); 	// Create note
		const author 		= await User.findById(req.session.userId); 	// Find user
		console.log(` -------------------- commentedAlbum -------------------- \n`, commentedAlbum);
		console.log(` -------------------- createdNote -------------------- \n`, createdNote);
		console.log(` -------------------- author -------------------- \n`, author);
		
		// author.linerNotes.push(createdNote);							// Add note to user

		// author.save(() => {
			// res.redirect('/linernotes');
		// })
	} catch(err){
		next(err)
	}
});

//put
router.put('/:id', async (req, res, next) => {
	
	try {
		const updatedNote 	= await LinerNotes.findByIdAndUpdate(req.params.id, req.body, {new: true});
		const foundUser 	= await User.findOne({'linerNotes._id': req.params.id});
		if(foundUser._id.toString() !== req.body.userId){
			foundUser.linerNotes.id(req.params.id).remove();

			foundUser.save(async (req, res, next) => {
				const newUser = await User.findById(req.body.userId);
				newUser.linerNotes.push(updatedNote);
				newuser.save(async (req, res, next) => {
					res.redirect('/linernotes')
				});
			});
		} else {
			foundUser.linerNotes.id(req.params.id).remove();
			foundUser.linerNotes.push(updatedNote);
			foundUser.save(() => {
				res.redirect('/linernotes')
			});
		}
	} catch(err){
		next(err)
	}
});

//delete

router.delete('/:id', async (req, res, next) => {
	
	try {
		const deletedNote 	= await LinerNotes.findByIdAndRemove(req.params.id);
		const foundUser 	= User.findOne({'linerNotes._id': req.params.id});
		foundUser.linerNotes.id(req.params.id).remove();
		foundUser.save(() => {
			res.redirect('/linernotes')
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