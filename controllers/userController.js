const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/userModel.js');
const Shelf 	= require('../models/shelfModel.js');
// const Album 	= require('../models/albumModel.js');
// const Note 		= require('../models/noteModel.js');


/**************************************************************************************
 *********************************** RESTFUL ROUTES *********************************** 
 **************************************************************************************/


// ************************* USER INDEX ROUTE ************************** Show all users?

router.get('/', async(req, res, next) => {
	try {
	    const allUsers = await User.find({});
	    res.render('../views/userViews/index.ejs', {
	    	users: allUsers
	    })
	} catch(err){
	    next(err);
	}
});


// ************************* USER SHOW ROUTE *************************** Logged or no logged shows a user's page

router.get('/:id', async(req, res, next) => {
	try {
	    const user = await User.findById(req.params.id);
	    res.render('../views/userViews/show.ejs', {
	    	user: user 
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
	try {
		if (req.session.logged) {								// If user logged on, lead to user's edit page
		    const user = await User.findById(req.params.id);
		    res.render('../views/userViews/edit.js', {
		    	user: user
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


// ************************* USER UPDATE ROUTE *************************

router.put('/:id', async(req, res, next) => {
	try {
	    const user = await User.findByIdAndUpdate(req.params.id, req.body);
	    res.redirect('/' + req.params.id);
	} catch(err){
	    next(err);
	}
});


// ************************* USER DESTROY ROUTE *************************
// Same rules as edit
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
		for (let i = 0; i < user.notes.length; i++){
			notesIds.push(user.notes[i].id);
		}
		// Delete Notes in User from Notes collection
		const deletedNotes = await Note.deleteMany({_id: {$in: notesIds}});

		/* ---------- Delete User ---------- */

		await user.delete();

	} catch(err){
	    next(err);
	}
});











module.exports = router;