const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const mongoose = require('../config/mongoose.config');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//Routes
app.use(routes);

//Server React Static File
app.use(express.static(path.join(__dirname, 'view')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/view/index.html'));
});

module.exports = app;
