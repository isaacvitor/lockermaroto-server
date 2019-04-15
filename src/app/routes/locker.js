const { Router } = require('express');
const LockerController = require('../controller/LockerController');

const route = Router();
route.get('/api/locker', LockerController.list);
route.get('/api/locker/:id', LockerController.get);
route.post('/api/locker', LockerController.create);
route.put('/api/locker/:id', LockerController.update);
route.put('/api/locker/:id/updateremoteusers', LockerController.updateRemoteUsers);
route.put('/api/locker/:id/updateekeyusers', LockerController.updateEKeyUsers);
route.delete('/api/locker/:id', LockerController.remove);

module.exports = route;
