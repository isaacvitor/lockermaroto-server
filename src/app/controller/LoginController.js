const User = require('../model/User');
const jwt = require('jsonwebtoken');

const generateToken = function(user) {
  return jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin, name: user.name },
    process.env.NAPP_SECRET
  );
};

module.exports = {
  async login(req, res) {
    const { user, pass } = req.body;

    try {
      const loginUser = await User.findOne({ user });

      if (!loginUser) {
        return res.status(401).send({ error: 'Login invalid' });
      }

      if (!(await loginUser.checkPassword(pass))) {
        return res.status(401).json({ message: 'Login invalid' });
      }
      const loginData = {
        user: { _id: loginUser._id, isAdmin: loginUser.isadmin, name: loginUser.name },
        token: generateToken(user)
      };
      res.send(loginData);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};
