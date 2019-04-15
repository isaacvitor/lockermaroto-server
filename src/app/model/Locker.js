const mongoose = require('mongoose');
const { Schema } = mongoose;
const { LockerStateSchema } = require('./LockerState');
/* 
Trancado = (Porta fechada + trava ativada + lckStateDetector=True) => lckState=[1,1,1]
Destrancado = (Porta fechada + trava desativada + lckStateDetector=True) => lckState=[1,0,1]
Aberto = (Porta aberta + trava aberta + lckStateDetector=False) => lckState=[0,0,0]
Desconhecido = Em tese apenas no servidor, caso o mesmo não tenha comunicação com o locker registrado.=> lckState=undefined
 */

const EKeyUserSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: [true, 'O Nome do usuário é requerido'] },
    ekey: { type: String, required: true }
  },
  { _id: false, id: false }
);

const RemoteUserSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: [true, 'O Nome do usuário é requerido'] }
  },
  { _id: false, id: false }
);

const LockerSchema = new Schema({
  name: { type: String, required: true, unique: true },
  mac: { type: String, required: true, unique: true },
  eKeyUsers: { type: [EKeyUserSchema] },
  remoteUsers: { type: [RemoteUserSchema] },
  preferences: { type: Schema.Types.Mixed },
  state: { type: LockerStateSchema }
});

module.exports = mongoose.model('Locker', LockerSchema);
