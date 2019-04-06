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
      const state = new LockerState();
      const lockerCreated = await Locker.create({ ...req.body, state });
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
  }
};
