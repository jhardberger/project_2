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
	    	users,
	    	session: req.session
	    })

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF NEW ROUTE **************************** // Should albums have a 'can-be-found-in-these-playlists'?

router.get('/new', async(req, res, next) => { 		
	try {
		// Find user
	    const user = await User.findById(req.session.userId);

	    // Make albums available (as checkboxes) to add them to shelf
	    // FOR NOW INSTANTIATED ALBUMS
	    const allAlbums = await Album.find({});

	    // Make user's albums available to add to shelf
	    // const userAlbums = [];
	    // user.albums.forEach(album=>userAlbums.push(album))
	    console.log(`---------- user ----------\n`, user);

	    res.render('../views/shelfViews/new.ejs', {
	    	// allUsers,
	    	user,
	    	allAlbums,
	    	session: req.session
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
	    const favoritedBy 	= await User.find({'favorites._id': req.params.id});

	    console.log(`--------------- favoritedBy ----------------`, favoritedBy);

	    res.render('../views/shelfViews/show.ejs', {
	    	shelf,
	    	shelfOwner,
	    	favoritedBy,
	    	session: req.session
	    });
	} catch(err){
	    next(err);
	}
});


// ************************* SHELF EDIT ROUTE *************************** 

router.get('/:id/edit', async(req, res, next) => {
	try {

    const shelf 		= await Shelf.findById(req.params.id);
    const shelfOwner 	= await User.findById(shelf.created_by);
    const allAlbums 	= await Album.find({});

	res.render('../views/shelfViews/edit.ejs', {
		shelf,
		shelfOwner,
		allAlbums,
		session: req.session
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
	    console.log(createdShelf);


		// ----------------------- ADD SHELF TO USER ----------------------- 

	    const user = await User.findById(createdShelf.created_by._id) 	// Find user
	   
	    user.shelves.push(createdShelf);								// Add Shelf to User

	    user.shelves.sort(function(shelfA, shelfB){						// Organize shelves alphanumerically
		    if(shelfA.title < shelfB.title) {return -1;}
		    if(shelfA.title > shelfB.title) {return 1;}
		    return 0;
		});
	  

		// ----------------------- ADD ALBUMS TO USER ----------------------- 

		createdShelf.albums.forEach(shelfAlbum => {											// For each album in the created shelf

			if (user.albums.length == 0){													// If user.albums is empty
				createdShelf.albums.forEach(alb => user.albums.push(alb))					// Add all createdShelf albums

			} else {																		// If not empty
				user.albums.forEach(userAlbum => {											// Check for duplicates
					if (user.albums.findIndex((alb) => alb.id === shelfAlbum.id) === -1) {	// If check returned -1 (i.e. no duplicates)
						user.albums.push(shelfAlbum);										// Add album
					}				
				})
			}
		});

		user.albums.sort(function(albumA, albumB){						// Organize albums alphanumerically
			if(albumA.artist < albumB.artist) {return -1;}
			if(albumA.artist > albumB.artist) {return 1;}
			return 0;
		});
	  

		// ---------------------------- Save / Redirect ---------------------------- 

	    await user.save();										
	    
        res.redirect('/users/' + user.id + '/edit');

	} catch(err){
	    next(err);
	}
});


// ************************* SHELF UPDATE ROUTE *************************

router.put('/:id', async(req, res, next) => {
	try {
		// ---------------------------- UPDATE SHELF ---------------------------- 

	    const updatedShelf 	= await Shelf.findById(req.params.id); 	// Find the shelf

	    updatedShelf.title 	= req.body.title						// Update title
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

        owner.shelves.id(req.params.id).remove();				// Remove old shelf from owner

        owner.shelves.push(updatedShelf);						// Add updated shelf to owner

		// ---------------------------- UPDATE USERS WHO HAVE FAVORITED SHELF ---------------------------- 

	    const favoritedUsers = await User.find({'favorites._id': req.params.id});

	    for (let i = 0; i < favoritedUsers.length; i++){
	    	for (let j = 0; j < favoritedUsers[i].favorites.length; j++){
        		if (favoritedUsers[i].favorites[j].id === req.params.id){
					favoritedUsers[i].favorites[j].remove();							// Remove old shelf from user favorites
					favoritedUsers[i].favorites.push(updatedShelf);						// Add updated shelf to user favorites
					favoritedUsers[i].save();
        		}	
	    	}
	    };

		// ---------------------------- Save / Redirect ---------------------------- 
        await owner.save();								

        if (req.session.logged && req.session.userId === owner.id){
	        res.redirect('/users/' + req.session.userId + '/edit');
        } else {
	        res.redirect('/auth/login');        	
        }

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

		// ---------------------------- DESTROY SHELVES OF USERS WHO HAVE FAVORITED SHELF ---------------------------- 

	    const favoritedUsers = await User.find({'favorites._id': req.params.id});

	    for (let i = 0; i < favoritedUsers.length; i++){
	    	for (let j = 0; j < favoritedUsers[i].favorites.length; j++){
        		if (favoritedUsers[i].favorites[j].id === req.params.id){
					favoritedUsers[i].favorites[j].remove();							// Remove old shelf from user favorites
					favoritedUsers[i].save();
        		}	
	    	}
	    };

		// ---------------------------- Save / Redirect ---------------------------- 
        owner.save();

        res.redirect('/shelves');

	} catch(err){
	    next(err);
	}
});


module.exports = router;

// ***********************************************************************
// ******************************** END **********************************
// ***********************************************************************