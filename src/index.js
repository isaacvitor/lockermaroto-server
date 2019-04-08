require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.development' : '.env.production'
});

const app = require('./app');

app.listen(process.env.NAPP_PORT, () => {
  console.log(`${process.env.NAPP_NAME} listening on port: ${process.env.NAPP_PORT}`);
});
