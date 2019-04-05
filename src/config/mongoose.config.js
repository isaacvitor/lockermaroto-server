const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.NAPP_MONGO_USER}:${process.env.NAPP_MONGO_PASS}@${
  process.env.NAPP_MONGO_HOST
}/lockermaroto?retryWrites=true`;
mongoose.connect(url, { useNewUrlParser: true });

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Mongoose connected');
});
