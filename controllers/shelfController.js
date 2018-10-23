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


// ************************* SHELF SHOW ROUTE ***************************

router.get('/:id', async(req, res, next) => {
	try {
	    const albumsInShelfIds = [];

	    const shelf 		= await Shelf.findById(req.params.id); 		// Find the shelf
	    const shelfOwner 	= await User.findById(shelf.created_by); 	// Find its owner (shelf.created_by is an id)


	    // shelf.albums.forEach(albumId => {albumsInShelfIds.push(albumId)}); // Get albums in shelf's Ids

	    // const albumsInShelf = await Album.find

	    console.log(`---------- shelf ----------\n`, shelf);
	    console.log(`---------- shelf.created_by ----------\n`, shelf.created_by);
	    console.log(`---------- shelf.albums ----------\n`, shelf.albums);

	    res.render('../views/shelfViews/show.ejs', {
	    	shelf,
	    	shelfOwner
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
		// Find creator Id (user who is logged on)
		const creator = await User.findOne({username: req.session.username});

	    // Shelf to be created
		const shelfToCreate = {
			title: 		req.body.title,
			created_by: creator,    	// Add creator
			albums: 	[],				// Albums will be pushed
			updated: 	new Date()		// Date of creation
		};

		// Find albums that were checked  by their Id
		const albumsToShelf = await Album.find({
			_id: {
				$in: req.body.albums
			}
		});
		// Add checked albums
		albumsToShelf.forEach(album => {
			shelfToCreate.albums.push(album);
		});

		// Create Shelf
	    const createdShelf = await Shelf.create(shelfToCreate);

	    // Find user
	    const user = await User.findById(createdShelf.created_by._id) 
	    // Add Shelf to User
	    user.shelves.push(createdShelf);
	    // Save User
	    await  user.save();

	    console.log(`-------------------- createdShelf --------------------\n`, createdShelf);

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
	    // Find user that OWNS the shelf (shelf.created_by)
	    const shelfToDestroy = await Shelf.findById(req.params.id);
	    console.log(`-------------------- shelfToDestroy --------------------\n`, shelfToDestroy);
	    console.log(`-------------------- shelfToDestroy.created_by --------------------\n`, shelfToDestroy.created_by);

	    // const owner = await User.findOne({'shelves._id': req.params.id});

		// Destroy Shelf
	    const shelf = await Shelf.findByIdAndDelete(req.params.id);

	    // Destroy owner's shelf
        // owner.shelves.id(req.params.id).remove();

	    // Save changes
        // owner.save();
        res.redirect('/shelves');

	} catch(err){
	    next(err);
	}
});






module.exports = router;