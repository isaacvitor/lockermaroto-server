const { Router } = require('express');
const UserController = require('../controller/UserController');

const route = Router();
route.get('/api/user', UserController.list);
route.get('/api/user/:id', UserController.get);
route.post('/api/user', UserController.create);
route.put('/api/user/:id', UserController.update);
route.delete('/api/user/:id', UserController.remove);
module.exports = route;
