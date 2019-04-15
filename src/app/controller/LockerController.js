const Locker = require('../model/Locker');
const { LockerState } = require('../model/LockerState');

module.exports = {
  async list(req, res) {
    try {
      const lockers = await Locker.find({}).sort(req.query.order || 'name');
      res.send(lockers);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const locker = await Locker.findById(req.params.id).select('-pass');
      res.send(locker);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const lockerCreated = await Locker.create(req.body);
      res.send({ lockerCreated });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      if (!req.params.id) throw new Error('Locker ID is required');
      const lockerDeleted = await Locker.deleteOne({ _id: req.params.id });
      res.send({ lockerDeleted });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      if (!req.params.id) throw new Error('Locker._id required');

      const lockerToUpdate = req.body;
      const lockerDB = await Locker.findById(req.params.id);
      if (lockerDB === null) {
        throw new TypeError('Locker._id is invalid');
      }
      const mergedLocker = Object.assign(lockerDB, lockerToUpdate);
      res.send(await mergedLocker.save());
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async updateRemoteUsers(req, res, next) {
    try {
      if (!req.params.id) throw new Error('Locker._id required');

      const remoteUsers = req.body;
      const lockerDB = await Locker.findById(req.params.id);
      if (lockerDB === null) {
        throw new TypeError('Locker not found');
      }
      lockerDB.remoteUsers = remoteUsers;
      res.send(await lockerDB.save());
    } catch (error) {
      next(error);
    }
  },

  async updateEKeyUsers(req, res, next) {
    try {
      if (!req.params.id) throw new Error('Locker._id required');

      const eKeyUsers = req.body;
      const lockerDB = await Locker.findById(req.params.id);
      if (lockerDB === null) {
        throw new TypeError('Locker not found');
      }
      lockerDB.eKeyUsers = eKeyUsers;
      const savedLocker = await lockerDB.save();

      const ioDevices = req.ioDevices;
      let ekeys = [];
      savedLocker.eKeyUsers.forEach(e => {
        ekeys.push(e.ekey);
      });
      const payload = { mac: lockerDB.mac, ekeys: ekeys };
      console.log('payload', payload);
      ioDevices.emit('updateUsers', payload);
      res.send(savedLocker);

      //! TODO Adcionar salvamento no device
    } catch (error) {
      console.log('------ updateEKeyUsers -------');
      console.log(error);
      next(error);
    }
  },

  async register(locker) {
    try {
      lockerToUpdate = await Locker.findOne({ mac: locker.mac });
      if (lockerToUpdate) {
        lockerToUpdate.name = locker.name;
        await lockerToUpdate.save();
        return lockerToUpdate;
      } else {
        const lockerCreated = await Locker.create({ mac: locker.mac, name: locker.name });
        return lockerCreated;
      }
    } catch (error) {
      console.log({ error: error.message });
    }
  }
};
