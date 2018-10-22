const express 	= require('express');
const router 	= express.Router();
const Shelf 	= require('../models/shelfModel.js');
const Album 	= require('../models/albumModel.js');
const User 		= require('../models/userModel.js');


/**************************************************************************************
 *********************************** RESTFUL ROUTES *********************************** 
 **************************************************************************************/


// ************************* SHELF INDEX ROUTE ************************** // Shows most popular Shelves?

router.get('/', async(req, res, next) => {
	try {
	    const allShelves = await Shelf.find({});
	    res.render('../views/shelfViews/index.ejs', {
	    	allShelves
	    })
	} catch(err){
	    next(err);
	}
});


// ************************* SHELF SHOW ROUTE ***************************

router.get('/:id', async(req, res, next) => {
	try {
	    const shelf = await Shelf.findById(req.params.id);
	    res.render('../views/shelfViews/show.ejs', {
	    	shelf: shelf
	    });
	} catch(err){
	    next(err);
	}
});


// ************************* SHELF NEW ROUTE **************************** // Should albums have a 'can-be-found-in-these-playlists'?

router.get('/new', async(req, res, next) => { 		
	try {
		// For now make all users available (as a drop down for shelves) to have createdBys ?
	    const allUsers  = await User.find({});

	    // Make albums available (as checkboxes) to add them to shelf ?
	    const allAlbums = await Album.find({});

	    res.render('../views/shelfViews/new.ejs', {
	    	allUsers,
	    	allAlbums
	    });

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF EDIT ROUTE *************************** 

// router.get('/:id/edit', async(req, res, next) => {
// 	try {

// 	    const shelf = await Shelf.findById(req.params.id);

// 		// Will only be available to logged user and shelf creator
// 		// if (session.logged && session.userId === shelf.createdBy){
// 		    // For now make it possible to edit createdBy by showing all users
// 		    const allUsers = await User.find({});
// 		    res.render('../views/shelfViews/edit.ejs', {
// 		    	shelf: shelf,
// 		    	users: allUsers
// 		    })
// 		// } else {
// 		// 	req.session.message = 'Not yo shelf!'
// 		// }

// 	} catch(err){
// 	    next(err);
// 	}
// });


// ************************* SHELF CREATE ROUTE *************************

router.post('/', async(req, res, next) => {
	try {
		// For now find the user's Id that was selected in new.ejs
		// const user = await User.findById(req.body.userId);

		// Later just use ID stored in logged session, createdBy will be done automatically
		// const user = User.findById(req.session.userId)

		// Create Shelf
	    const createdShelf = await Shelf.create(req.body);

		// Add albums that were checked?
		// Albums checked on page will be added by their Id
		// Must verify what req.body.albumsIds will be (array of objects? strings?)
		// for (let i = 0; req.body.albumsIds.length; i++){
		// 	createdShelf.albums.push(req.body.albums[i]);
		// }

	    // Add Shelf to User
	    // user.shelves.push(createdShelf);

	    // Save User
	    // await user.save();

	    res.redirect('/shelves');

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF UPDATE ROUTE *************************

// router.put('/:id', async(req, res, next) => {
// 	try {
// 	    const updatedShelf = await Shelf.findByIdAndUpdate(req.params.id, req.body, {new: true});

// 	    // Find user that OWNS the shelf to update their shelf
// 	    const owner = await User.findOne({'shelves._id': req.params.id});

// 	    // Remove old shelf from owner
//         owner.shelves.id(req.params.id).remove();

//         // Add updated shelf to owner
//         owner.shelves.push(updatedShelf);

//         // Save changes
//         owner.save();

// 	} catch(err){
// 	    next(err);
// 	}
// });


// ************************* SHELF DESTROY ROUTE *************************

router.delete('/:id', async(req, res, next) => {
	try {
		// Destroy Shelf
	    const shelf = await Shelf.findByIdAndRemove(req.params.id);

	    // Find user that OWNS the shelf
	    const owner = await User.findOne({'shelves._id': req.params.id});

	    // Destroy owner's shelf
        owner.shelves.id(req.params.id).remove();

	    // Save changes
        owner.save();

	} catch(err){
	    next(err);
	}
});






module.exports = router;