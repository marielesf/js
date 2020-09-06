import express from 'express';
import mongoose from 'mongoose';
import { opRouter } from './src/operationRouter.js';

require('dotenv').config();
mongoose.connect(
  'mongodb+srv://' +
    process.evn.USERDB +
    ':' +
    process.env.PWDDB +
    '@cluster0.3tdtv.gcp.mongodb.net/banco?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();
app.use(express.json());
app.use(opRouter);
app.listen(process.env.PORT, () => {
  console.log('API  ok');
});
