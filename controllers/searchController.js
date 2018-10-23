const express	 = require('express');
const router 	 = express.Router();
const request 	 = require('superagent');

																	//discogs
const disconnect 	= require('disconnect');
const Discogs 		= require('disconnect').Client;
const db 			= new Discogs().database();
const token 		= 'WTTOEjBUVdyxkdXoXYknEggHNyUjHwRdnIJaokxD';

																	//Elasticsearch 

// const elasticsearch = require('elasticsearch');
// const esClient 		= new elasticsearch.Client({
//   host: 'localhost:3000',
//   log: 'error'
// });


// /database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}
																	//routes

router.get('/', (req, res) => {
	res.render('searchViews/new.ejs', {});
});

router.post('/', async (req, res, next) => {
	
	try {

		let ourQuery = req.body.query.split(' ').join('-');
		
		console.log(ourQuery, 'our query--------------------------');

		request
			.get('api.discogs.com/database/search?artist=' + ourQuery + '&per_page=3&page=1&token=' + token)
			.end((err, data)=>{
				if(err){
					console.log(err);
				}

				console.log(data);
				const albumData = JSON.parse(data.text)

				console.log("---------------------------album data after JSON.parse-----------------------")
	            console.log(albumData);
	            console.log("---------------------------album  data-----------------------")

	            res.send('ceck out that terminal baby')
			});



	} catch(err){
		next(err)
	}
	
});

module.exports = router;