const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const mongoose = require('../config/mongoose.config');
const mongooseMidllewareHandle = require('./middleware/mongoose');

const app = express();
const server = require('http').Server(app);

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

//IO
const io = require('socket.io')(server);
const LockerController = require('./controller/LockerController');
let SOCKET_LOCKERS = {};

//Socket to Users
const ioUsers = io.of('users').on('connection', function(socket) {
  console.log('USER connected');
  socket.on('lockLocker', function(data) {
    const { mac } = data;
    try {
      socketLocker = SOCKET_LOCKERS[mac] ? SOCKET_LOCKERS[mac] : null;
      if (socketLocker) {
        socketLocker.emit('lockRemote', data);
      } else {
        socket.emit('errorEvent', { message: 'Locker indisponível' });
      }
    } catch (err) {
      console.log(err.message);
      socket.emit('errorEvent', { message: err.message });
    }
  });

  socket.on('unlockLocker', function(data) {
    const { mac } = data;
    try {
      socketLocker = SOCKET_LOCKERS[mac] ? SOCKET_LOCKERS[mac] : null;
      if (socketLocker) {
        socketLocker.emit('unlockRemote', data);
      } else {
        socket.emit('errorEvent', { message: 'Locker indisponível' });
      }
    } catch (err) {
      console.log(err.message);
      socket.emit('errorEvent', { message: err.message });
    }
  });
});

//Lockers
io.on('connection', function(socket) {
  console.log('Device connected');

  socket.on('lockerState', async function(data) {
    console.log('Locker State', data);
    const { pins, locker } = data;
    if (!pins.isRegister) {
      try {
        const result = await LockerController.register({
          mac: locker.mac,
          name: locker.name
        });
        console.log('Register result', result);
        SOCKET_LOCKERS[result.mac] = socket;
        socket.emit('lockerRegister', { _id: result._id, name: result.name, mac: result.mac });
      } catch (error) {
        console.log('Register error:', error);
      }
    }
    SOCKET_LOCKERS[locker.mac] = SOCKET_LOCKERS[locker.mac] ? SOCKET_LOCKERS[locker.mac] : socket;
    console.log('Locker State', data);
    ioUsers.emit('updateLockerState', data);
    //socket.emit('lock', { hello: 'world' });
  });

  socket.on('lockerUpdateStateByUser', async function(data) {
    console.log('Locker State BY User', data);
    ioUsers.emit('updateLockerState', data);
  });

  socket.on('lockerUID', async function(data) {
    console.log('Locker UID', data);
    ioUsers.emit('lockerReadUID', data);
    //socket.emit('lock', { hello: 'world' });
  });
});

app.use((req, res, next) => {
  req.ioDevices = ioDevices;
  req.ioUsers = ioUsers;
  next();
});

app.use(mongooseMidllewareHandle);

module.exports = { app, io, server };
