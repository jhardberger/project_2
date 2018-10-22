const express 	= require('express');
const app 		= express();
const PORT 		= 3000;
const session 	= require('express-session');


// ************************* Discogs Module/Database **************************

const disconnect 	= require('disconnect');
const Discogs 		= require('disconnect').Client;
const db 			= new Discogs().database();


// ************************* Require MiddleWare **************************

const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');


// ************************* Require Controllers **************************

const userController 	= require('./controllers/userController.js');
const shelfController 	= require('./controllers/shelfController.js');
// const albumController 	= require('./controllers/albumController.js');
// const noteController 	= require('./controllers/noteController.js');
const authController	= require('./controllers/authController.js');


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
// app.use('/albums', albumController);
// app.use('/notes', noteController);
app.use('/auth', authController);


// ************************* Retrieve Data Test **************************

app.get('/home', (req, res) => {

    db.getRelease(81013, function(err, data){
        res.render('home.ejs');
        // res.send(data);
        console.log(`-------------------------- DATA --------------------------\n`,data);
    });
});


// ************************* PORT SETUP **************************

app.listen(3000, () => {
    console.log(`Listening on port: ${PORT}`);
});