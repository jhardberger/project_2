const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// const session = require('express-session');
//db
require('./db/db');
//controllers
const linerNotesController = require('./controllers/linerNotes');

//discogs
const disconnect = require('disconnect');
const Discogs = require('disconnect').Client;
const db = new Discogs().database();

//middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// app.use(session({
// 	secret: 'some random secret string',
// 	resave: false,
// 	saveUninitialized: false
// }));

app.use('/linernotes', linerNotesController);

//routes, etc.
app.get('/', (req, res) => {

    db.getRelease(81013, function(err, data){
        res.send(data);
        // console.log(`-------------------------- DATA --------------------------\n`,data);
    });
});



app.listen(3000, () => {
    console.log(`Listening on port: ${PORT}`);
});