const mongoose = require('mongoose');

<<<<<<< HEAD
const connectionString = 'mongodb://localhost/waxxy';
=======
const connectionString = 'mongodb://localhost/project2';
>>>>>>> 1509dbf0a5b5ed825c89af73e5584cc22a71b807

mongoose.connect(connectionString, { useNewUrlParser: true});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected at ', connectionString);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected ');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose error ', err);
});
