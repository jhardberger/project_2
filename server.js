const express = require('express');
const app = express();
const PORT = 3000;

//discogs
const disconnect = require('disconnect');

const Discogs = require('disconnect').Client;

const db = new Discogs().database();



app.get('/', (req, res) => {

    db.getRelease(81013, function(err, data){
        res.send(data);
        // console.log(`-------------------------- DATA --------------------------\n`,data);
    });
});



app.listen(3000, () => {
    console.log(`Listening on port: ${PORT}`);
});