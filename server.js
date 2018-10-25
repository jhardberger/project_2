const express 	= require('express');
const app 		= express();
const PORT 		= process.env.PORT || 3000;
const session 	= require('express-session');

require('./db/db');

// ************************* Discogs Module/Database **************************

const disconnect 	= require('disconnect');
const Discogs 		= require('disconnect').Client;
const discogsDb 	= new Discogs().database();

// ************************* Require MiddleWare **************************

const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');

// ************************* Require Controllers **************************

const userController 		= require('./controllers/userController.js');
const shelfController 		= require('./controllers/shelfController.js');
const albumController 		= require('./controllers/albumController.js');
const authController		= require('./controllers/authController.js');
const linerNoteController 	= require('./controllers/linerNoteController.js');
const searchController 	= require('./controllers/searchController.js');

// ************************* Use MiddleWare **************************

app.use(session({
	secret: 'Our random secret string?',
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public')); 	// Add CSS through 'public' directory


// *************** Upcoming feature - Logged user can access their page from any route ****************

app.use('/', async (req, res, next) => {
	console.log(`--------------------- Custom MiddleWare: req.session.{prop} ---------------------`);
	console.log(`username:`, req.session.username);
	console.log(`logged:`, req.session.logged);
	console.log(`userId:`, req.session.userId);

	// if (req.session.logged == 'undefined'){
	// 	res.redirect('/auth/login');
	// } else {

	// }

	next();	
});

// ************************* Use Controllers **************************

app.use('/users', userController);
app.use('/shelves', shelfController);
app.use('/albums', albumController);
app.use('/linernotes', linerNoteController);
app.use('/auth', authController);
app.use('/search', searchController);


app.get('/home', (req, res) => {
	// discogsDb.getRelease(7448549, (err, data) => {
	// 	console.log(data);
		res.render('homepage.ejs', {session: req.session})
	// })
});

// ************************* PORT SETUP **************************


app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});


// ***********************************************************************
// ******************************** END **********************************
// ***********************************************************************