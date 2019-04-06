const mongoose = require('mongoose');
const { Schema } = mongoose;

const LockerStateSchema = new Schema({
  locker_id: { type: Schema.Types.ObjectId, index: true },
  state: {
    type: String,
    enum: ['LOCKED', 'UNLOCKED', 'OPEN', 'UNKNOWN'],
    required: true,
    default: 'UNKNOWN'
  },
  code: { type: String, enum: ['111', '101', '000'], required: true, default: '000' },
  user: { type: Schema.Types.ObjectId },
  createAt: { type: Date, required: true, default: Date.now }
});

module.exports = {
  LockerState: mongoose.model('LockerState', LockerStateSchema),
  LockerStateSchema
};
