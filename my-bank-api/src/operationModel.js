import mongoose from 'mongoose';

const schemaa = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 1,
  },
});
const contatModel = mongoose.model('clientes', schemaa, 'clientes');
export { contatModel };
