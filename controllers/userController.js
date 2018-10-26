const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/userModel.js');
const Shelf 	= require('../models/shelfModel.js');
const Album 	= require('../models/albumModel.js');
const LinerNote = require('../models/linerNoteModel.js');

// ************************* Declare Genres **************************
const genres = ['Blues', 'Brass & Military', 'Children\'s', 'Classical', 'Electronic', 'Folk, World, & Country', 'Funk / Soul', 'Hip-Hop', 'Jazz', 'Latin', 'Non-Music', 'Pop', 'Reggae', 'Rock', 'Stage & Screen'];

/**************************************************************************************
 *********************************** RESTFUL ROUTES *********************************** 
 **************************************************************************************/


// ************************* USER INDEX ROUTE ************************** Show all users?

router.get('/', async(req, res, next) => {
	try {
		// await User.deleteMany();
		// await Shelf.deleteMany();
		// await Album.deleteMany();
		// await LinerNote.deleteMany();

	    const allUsers = await User.find({});
	    res.render('../views/userViews/index.ejs', {
	    	users: allUsers,
	    	session: req.session
	    })
	} catch(err){
	    next(err);
	}
});


// ************************* USER SHOW ROUTE *************************** Logged or no logged shows a user's page

router.get('/:id', async(req, res, next) => {
	try {
	    const user = await User.findById(req.params.id);
	    const spinning = await Album.findById(user.spinning);
	    const userFavorites = await Shelf.find({'liked_by': req.session.userId}).populate('created_by');
	    const userNotes = await LinerNote.find({'author[0]': req.session.userId});

	    // userNotes.forEach(note => {note.populate('author')});

	    // console.log(`---------- user ----------\n`, user);
	    // console.log(`---------- userFavorites ----------\n`, userFavorites);
	    // console.log(`---------- user.linerNotes[0] ----------\n`, user.linerNotes[0]);
	    // console.log(`---------- userNotes ----------\n`, userNotes);

	    res.render('../views/userViews/show.ejs', {
	    	user,
	    	spinning,
	    	userFavorites,
	    	userNotes,
	    	session: req.session
	    })
	} catch(err){
	    next(err);
	}
});


// ************************* USER NEW ROUTE ****************************

router.get('/new', (req, res) => {
	res.redirect('/auth/register');
});


// ************************* USER EDIT ROUTE ***************************

// User can access this route only if logged on (user _id will be kept in session?)
// Route can only be accessed through link on "My Profile" (which is their own show page)
router.get('/:id/edit', async(req, res, next) => {	

    const user = await User.findById(req.params.id);

	try {
		if (req.session.logged && req.session.username === user.username) {		// If CORRECT user logged on, lead to user's edit page
		    res.render('../views/userViews/edit.ejs', {
		    	user,
		    	allGenres: genres,
		    	session: req.session
		    })

		} else {												// If not lead to auth/login page
			res.redirect('/auth/login');
		}
	} catch(err){
	    next(err);
	}
});


// ************************* USER CREATE ROUTE *************************

router.post('/', async(req, res, next) => {
	try {
	    res.redirect('/auth/register');
	} catch(err){
	    next(err);
	}
});

// ************************* USER'S FAVORITES CREATE ROUTE *************************

router.post('/:id/favorites', async(req, res, next) => {
	try {

		const favoriteShelf = await Shelf.findById(req.body.favorite); 			// Find favorited shelf by its id 

	    const user = await User.findById(req.session.userId) 										// Find user	  

		// ----------------------- ADD USER TO SHELF'S FAVORITED BY ----------------------- 

		favoriteShelf.liked_by.push(user.id);

		// ----------------------- ADD SHELF TO LOGGED USER'S FAVORITES ----------------------- 

		if (user.favorites.length == 0){															// If user.favorites is empty
			user.favorites.push(favoriteShelf);														// Add shelf to user favorites

		} else {																					// If not empty
			user.favorites.forEach(userFavoriteShelf => {												// Check for duplicates
				if (user.favorites.findIndex((shelf) => shelf.id == favoriteShelf.id) === -1) {	// If check returned -1 (i.e. no duplicates)
					user.favorites.push(favoriteShelf);												// Add shelf to favorites
				}				
			})
		};

		// ---------------------------- Save / Redirect ---------------------------- 
		await favoriteShelf.save();
	    await user.save();	

	    res.redirect('/shelves/' + req.body.favorite);
	} catch(err){
	    next(err);
	}
});

// ************************* USER UPDATE ROUTE *************************

router.put('/:id', async(req, res, next) => {
	try {
	    const user = await User.findByIdAndUpdate(req.params.id, req.body);
	    res.redirect('/users/' + req.params.id);
	} catch(err){
	    next(err);
	}
});


// ************************* USER DESTROY ROUTE *************************
router.delete('/:id', async(req, res, next) => {
	try {
		// Find User
		const user 		= await User.findById(req.params.id);
		let shelvesIds 	= [];
		let notesIds 	= [];

		/* ---------- Delete Shelves ---------- */

		// Find Shelves Ids(through id of those belonging to user) and add them to above array
		for (let i = 0; i < user.shelves.length; i++){
			shelvesIds.push(user.shelves[i].id);
		}
		// Delete Shelves in User from Shelves collection
		const deletedShelves = await Shelf.deleteMany({_id: {$in: shelvesIds}});

		/* ---------- Delete Notes ---------- */

		// Find Notes Ids(through id of those belonging to user) and add them to above array
		// for (let i = 0; i < user.notes.length; i++){
		// 	notesIds.push(user.notes[i].id);
		// }
		// Delete Notes in User from Notes collection
		// const deletedNotes = await Note.deleteMany({_id: {$in: notesIds}});

		/* ---------- Delete User ---------- */

		await user.delete();
		res.redirect('/users');

	} catch(err){
	    next(err);
	}
});


// ************************* USER'S FAVORITES DESTROY ROUTE *************************

router.delete('/:id/favorites/delete', async(req, res, next) => {
	console.log(`YOOOOOOOOOOOOOOOOOOOOOOOOOOO`);
	try {
		const user 		= await User.findById(req.params.id);		// Find User

		console.log(`req.body.deletedShelfId\n`, req.body.deletedShelfId);
		// Delete shelf from user's favorites
		user.favorites.id(req.body.deletedShelfId).remove();	

		await user.save();	

		res.redirect('/users/'+ req.params.id +'/edit');

	} catch(err){
	    next(err);
	}
});


module.exports = router;

// ***********************************************************************
// ******************************** END **********************************
// ***********************************************************************