require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

const { app, server } = require('./app');

server.listen(process.env.NAPP_PORT,'0.0.0.0', () => {
  console.log(`${process.env.NAPP_NAME} listening on port: ${process.env.NAPP_PORT}`);
});
