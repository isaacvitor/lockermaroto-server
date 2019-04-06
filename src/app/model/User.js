const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const RoleSchema = new Schema({
  name: { type: String, required: true, default: 'user' },
  code: { type: Number, required: true, default: 2 }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  user: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  ekey: { type: String, index: true, unique: true },
  isadmin: { type: Boolean, required: true, default: false }
});
UserSchema.pre('save', async function(next) {
  this.pass = await bcrypt.hash(this.pass, 8);
  next();
});
module.exports = mongoose.model('User', UserSchema);
