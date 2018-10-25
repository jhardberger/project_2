const express 	= require('express');
const router 	= express.Router();
const User 		= require('../models/userModel.js');
const Shelf 	= require('../models/shelfModel.js');		// When the time comes
const Album 	= require('../models/albumModel.js');		//		'		'
const LinerNote = require('../models/linerNoteModel.js');	//		'		'

// const bcrypt 	= require('bcrypt'); 					// 		'		'

// ************************* Declare Genres **************************
const genres = ['Blues', 'Brass & Military', 'Children\'s', 'Classical', 'Electronic', 'Folk, World, & Country', 'Funk / Soul', 'Hip-Hop', 'Jazz', 'Latin', 'Non-Music', 'Pop', 'Reggae', 'Rock', 'Stage & Screen'];


// ************************* REGISTER 'INDEX' ROUTE **************************

router.get('/register', (req, res) => {
	// console.log(`-------------------- req.session REGISTER --------------------\n`, req.session);
	res.render('authViews/register.ejs', {
		genres, 
		session: req.session
	});
});


// ************************* REGISTER CREATE ROUTE ***************************

router.post('/register', async (req, res, next) => {

	try {
	    const user = await User.find({username: req.body.username}); // Check if user exists

	    if (user.length == 0){
	    	const password = req.body.password;
	    	// Hash password
			// const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

		    // Create object {} for database entry
		    const userDbEntry 		= {};

		    userDbEntry.username 	= req.body.username;
		    userDbEntry.bio 		= req.body.bio;
		    console.log(`-------------------- req.body register --------------------\n`, req.body);
		    userDbEntry.genres 		= req.body.genres

		    userDbEntry.password 	= password;
		    // userDbEntry.password = passwordHash;

		    // Put password into database
		    const createdUser = await User.create(userDbEntry);

		    console.log(`-------------------- userDbEntry REGISTER --------------------\n`, userDbEntry);

	        // Initialize session (attach properties to session middleware, accessible through every route)
		    req.session.username = req.body.username;
		    req.session.logged   = true;
		    console.log(`-------------------- req.session --------------------\n`, req.session);

		    res.redirect('/home');

	    } else {
		    console.log('Sorry! This username has already been taken :(');
		    res.redirect('/auth/register');
	    }
	} catch(err){
	    next(err);
	}
});


// ************************* LOGIN 'INDEX' ROUTE **************************

router.get('/login', (req, res) => {
	// console.log(`-------------------- req.session LOGIN --------------------\n`, req.session);
	res.render('authViews/login.ejs', {
		session: req.session
	});
});


// ************************* LOGIN CREATE ROUTE ***************************

router.post('/login', async(req, res, next) => {

	try {
	    const user = await User.find({username: req.body.username})

	    if (user.length !== 0){

		    req.session.username = req.body.username;
		    req.session.logged   = true;
		    req.session.userId 	 = user[0]._id;

		    res.redirect('/users/' + user[0]._id);

			console.log(`-------------------- User Entry --------------------\n`, req.session);

	    } else {
			console.log(`-------------------- User Entry --------------------\n`, req.body);
	    	console.log(`Invalid username`);
	    	res.redirect('/auth/login');
	    }

	} catch(err){
	    next(err);
	}
});

// ************************* LOGOUT INDEX ROUTE ***************************

router.get('/logout', (req, res) => {
	req.session.destroy((err)=>{
		if(err){
     		res.send(err);
    	} else {
     		res.redirect('/auth/login');
    	}
  	});
});


module.exports = router;

// ***********************************************************************
// ******************************** END **********************************
// ***********************************************************************