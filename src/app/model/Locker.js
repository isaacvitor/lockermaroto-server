const mongoose = require('mongoose');
const { Schema } = mongoose;
const { LockerStateSchema } = require('./LockerState');
/* 
Trancado = (Porta fechada + trava ativada + lckStateDetector=True) => lckState=[1,1,1]
Destrancado = (Porta fechada + trava desativada + lckStateDetector=True) => lckState=[1,0,1]
Aberto = (Porta aberta + trava aberta + lckStateDetector=False) => lckState=[0,0,0]
Desconhecido = Em tese apenas no servidor, caso o mesmo não tenha comunicação com o locker registrado.=> lckState=undefined
 */

const UserEKeySchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    user_ekey: { type: String, unique: true }
  },
  { _id: false, id: false }
);

const KeyWithSchema = new Schema(
  {
    user: { type: Schema.Types.Mixed, required: true },
    startAt: { type: Date, required: true, default: Date.now },
    endAt: { type: Date, required: true, default: () => Date.now() + 5000 }
  },
  { _id: false, id: false }
);

const LockerSchema = new Schema({
  name: { type: String, required: true, unique: true },
  mac: { type: String, required: true, unique: true },
  users: { type: [UserEKeySchema] },
  keyWith: KeyWithSchema,
  state: { type: LockerStateSchema }
});

module.exports = mongoose.model('Locker', LockerSchema);
