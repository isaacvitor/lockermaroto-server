const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const RoleSchema = new Schema({
  name: { type: String, required: true, default: 'user' },
  code: { type: Number, required: true, default: 2 }
});

const UserSchema = new Schema({
  name: { type: String, required: [true, 'O Nome do usuário é requerido'] },
  user: { type: String, required: [true, 'O Usuário  é requerido'], unique: true },
  pass: { type: String, required: [true, 'A Senha é requerida'] },
  ekey: { type: String, unique: true },
  isadmin: { type: Boolean, default: false }
});

UserSchema.methods.checkPassword = function(pass) {
  return bcrypt.compare(pass, this.pass);
};

UserSchema.pre('save', async function(next) {
  this.pass = await bcrypt.hash(this.pass, 8);
  next();
});

UserSchema.path('name').validate(value => {
  const regex = /[a-zA-Z]+[a-zA-Z ]{4,50}/g;
  return regex.test(value);
}, 'Nome não é válido');

UserSchema.path('user').validate(value => {
  const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return regex.test(value);
}, 'O usuário deve conter um email válido.');

module.exports = mongoose.model('User', UserSchema);
