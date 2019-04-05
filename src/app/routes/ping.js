const { Router } = require('express');

const ping = Router();
ping.get('/ping', (req, res) => {
  res.send('...pong');
});

module.exports = ping;
