const express 	= require('express');
const app 		= express();
const PORT 		= 3000;
const session 	= require('express-session');

require('./db/db')


// ************************* Discogs Module/Database **************************

const disconnect 	= require('disconnect');
const Discogs 		= require('disconnect').Client;
const discogsDb 	= new Discogs().database();


// ************************* Require MiddleWare **************************

const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');


// ************************* Require Controllers **************************

const userController 	= require('./controllers/userController.js');
const shelfController 	= require('./controllers/shelfController.js');
const albumController 	= require('./controllers/albumController.js');
const authController	= require('./controllers/authController.js');
const linerNoteController 	= require('./controllers/linerNoteController.js');


// ************************* Use MiddleWare **************************

app.use(session({
	secret: 'Our random secret string?',
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public')); 	// Add CSS through 'public' directory


// ************************* Use Controllers **************************

app.use('/users', userController);
app.use('/shelves', shelfController);
app.use('/albums', albumController);
app.use('/linernotes', linerNoteController);
app.use('/auth', authController);


app.get('/home', (req, res) => {
	discogsDb.getRelease(56046, (err, data) => {
		// console.log(data);
		res.render('homepage.ejs')
	})
})



// ************************* PORT SETUP **************************


app.listen(3000, () => {
    console.log(`Listening on port: ${PORT}`);
});