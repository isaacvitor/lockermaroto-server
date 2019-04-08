const { Router } = require('express');
const controller = require('../controller/LoginController');

const route = Router();
route.post('/api/login', controller.login);

module.exports = route;
