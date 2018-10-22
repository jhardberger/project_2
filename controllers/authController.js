const express 	= require('express');
const router 	= express.Router();
// const bcrypt 	= require('bcrypt'); // When the time comes
const User = require('../models/userModel.js');



router.get('/register', (req, res) => {
	console.log(`-------------------- req.session --------------------\n`, req.session);
	rea.render('authViews/register.ejs');
})








module.exports = router;