const mongoose = require('mongoose');

const mongoDbUrl = process.env.MONGODB_URI || 'mongodb://localhost/waxxy';

const connectionString = 'mongodb://localhost/waxxy';

mongoose.connect(mongoDbUrl, { useNewUrlParser: true});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected at: ', connectionString);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose error ', err);
});
