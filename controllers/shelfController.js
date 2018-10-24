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

	    const users = await User.find({});

	    res.render('../views/shelfViews/index.ejs', {
	    	allShelves,
	    	users
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

	    res.render('../views/shelfViews/show.ejs', {
	    	shelf,
	    	shelfOwner
	    });
	} catch(err){
	    next(err);
	}
});


// ************************* SHELF EDIT ROUTE *************************** 

router.get('/:id/edit', async(req, res, next) => {
	try {

    const shelf = await Shelf.findById(req.params.id);
    const shelfOwner 	= await User.findById(shelf.created_by);
    const allAlbums = await Album.find({});

	res.render('../views/shelfViews/edit.ejs', {
		shelf,
		shelfOwner,
		allAlbums
	})

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF CREATE ROUTE *************************

router.post('/', async(req, res, next) => {

	try {

		// ------------------------- MAKE SHELF ------------------------- 

		const creator = await User.findOne({username: req.session.username}); // Find creator Id (user who is logged on)

		const shelfToCreate = {				// Shelf to be created
			title: 		req.body.title,
			created_by: creator,    		// Add creator
			albums: 	[],					// Albums will be pushed
			updated: 	new Date()			// Date of creation
		};

		const albumsToShelf = await Album.find({					// Find albums that were checked by their Id
			_id: {
				$in: req.body.albums
			}
		});

		albumsToShelf.forEach(album => {							// Add checked albums to shelf
			shelfToCreate.albums.push(album);
		});

	    const createdShelf = await Shelf.create(shelfToCreate);		// Create Shelf


		// ----------------------- ADD SHELF TO USER ----------------------- 

	    const user = await User.findById(createdShelf.created_by._id) 	// Find user
	   
	    user.shelves.push(createdShelf);								// Add Shelf to User
	  

		// ----------------------- ADD ALBUMS TO USER ----------------------- 

		// ********** ATTEMPT 1 **********

		// // Test for duplicates fctn
		// function findIfDuplicate(userAlbum) {		// RETURNS ID OF DUPLICATE IN USERALBUM
		// 	return userAlbum.id === shelfAlbum.id; 	// If no match, returns -1
		// };


		// createdShelf.albums.forEach(shelfAlbum => {		// For each album in the created shelf
		// 	if (user.albums == []){						// If user.albums is empty
		// 		user.albums = createdShelf.albums;		// Add all createdShelf albums
		// 	} else {									// If not empty
		// 		user.albums.forEach(userAlbum => {										// Check for duplicates
		// 			if (user.albums.findIndex(findIfDuplicate(userAlbum)) === -1){		// If check returned -1 (i.e. no duplicates)
		// 				user.albums.push(shelfAlbum);									// Add album
		// 			}				
		// 		})
		// 	}
		// });


		// ********** ATTEMPT 2 **********

		// Make two arrays of album ids to compare
		// userAlbumIds = []
		// user.albums.forEach(userAlbum => {
		// 	userAlbumIds.push(userAlbum.id);
		// });

		// createdShelfAlbumIds = [];
		// createdShelf.albums.forEach(shelfAlbum => {
		// 	createdShelfAlbumIds.push(shelfAlbum.id);
		// });

		// noDuplicates = userAlbumIds.concat(createdShelfAlbumIds.filter(function(item){
		// 	return userAlbumIds.indexOf(item) < 0;
		// }));
		// let noDuplicates = [];

		// if (typeof userAlbumIds !== 'undefined' && userAlbumIds.length === 0){
		// 	noDuplicates = createdShelfAlbumIds;
		// } else {
		// 	noDuplicates = Array.from(new Set(userAlbumIds.concat(createdShelfAlbumIds)));	
		// }

		// ---------------------------- SAVE USER ---------------------------- 

	    await user.save();											// Save User
	    
	    console.log(`-------------------- createdShelf --------------------\n`, createdShelf);
	    console.log(`-------------------- usershelf1 --------------------\n`, user.shelves[0]);
	    console.log(`-------------------- usershelf2 --------------------\n`, user.shelves[1]);
	    // console.log(`-------------------- noDuplicates --------------------\n`, noDuplicates);	    
        res.redirect('/users/' + user.id + '/edit');

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF UPDATE ROUTE *************************

router.put('/:id', async(req, res, next) => {
	try {
		// ---------------------------- UPDATE SHELF ---------------------------- 

	    const updatedShelf = await Shelf.findById(req.params.id); 	// Find the shelf

	    updatedShelf.title = req.body.title							// Update title
	    updatedShelf.albums = [];									// Empty shelf albums

	    const desiredAlbums = await Album.find({					// Get desired albums from database
	    	_id: {
	    		$in: req.body.albums
	    	}
	    });

	    desiredAlbums.forEach(album => {
	    	updatedShelf.albums.push(album);
	    });

	    await updatedShelf.save();

		// ---------------------------- UPDATE SHELF OWNER ---------------------------- 

	    const owner = await User.findOne({'shelves._id': req.params.id});

        owner.shelves.id(req.params.id).remove();	// Remove old shelf from owner

        owner.shelves.push(updatedShelf);			// Add updated shelf to owner

		// ---------------------------- Save / Redirect ---------------------------- 
        owner.save();								

        res.redirect('/users/' + user + '/edit');

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF DESTROY ROUTE *************************

router.delete('/:id', async(req, res, next) => {
	try {
		// ---------------------------- FIND SHELF TO DESTROY ---------------------------- 

	    const shelfToDestroy = await Shelf.findById(req.params.id);

		// ---------------------------- DESTROY SHELF ---------------------------- 

	    const shelf = await Shelf.findByIdAndDelete(req.params.id);

		// ---------------------------- DESTROY OWNER'S SHELF ---------------------------- 
	    
	    const owner = await User.findById(shelfToDestroy.created_by);

        owner.shelves.id(req.params.id).remove();

		// ---------------------------- Save / Redirect ---------------------------- 
        owner.save();

        res.redirect('/shelves');

	} catch(err){
	    next(err);
	}
});






module.exports = router;