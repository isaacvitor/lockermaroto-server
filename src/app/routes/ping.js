const { Router } = require('express');
const path = require('path');

const ping = Router();
ping.get('/ping', (req, res) => {
  res.send('...pong');
});

module.exports = ping;
