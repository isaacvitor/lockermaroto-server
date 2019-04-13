const User = require('../model/User');

module.exports = {
  async get(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-pass');
      res.send(user);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async create(req, res, next) {
    try {
      const userCreated = await User.create(req.body);
      res.send({ userCreated });
    } catch (error) {
      next(error);
    }
  },

  async list(req, res) {
    try {
      const users = await User.find({})
        .sort(req.query.order || 'name')
        .select('-pass');
      res.send(users);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      if (!req.params.id) throw new Error('User ID is required');
      const userDeleted = await User.deleteOne({ _id: req.params.id });
      res.send({ userDeleted });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  async update(req, res, next) {
    try {
      if (!req.params.id) throw new Error('User._id required');

      const userToUpdate = req.body;
      const userDB = await User.findById(req.params.id);
      const mergedUser = Object.assign(userDB, userToUpdate);
      res.send(await mergedUser.save());
    } catch (error) {
      next(error);
    }
  }
};
