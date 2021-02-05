import utils from './utils';
import express from 'express';
import mongoose from 'mongoose';
import wordRouter from './routes/word';
import cors from 'cors';

const port = process.env.EXPRESS_PORT;
const user = process.env.MONGOATLAS_USER;
const pw = process.env.MONGOATLAS_PASSWORD;
const db = process.env.MONGOATLAS_DB;
const mongoAtlasConnectionString = `mongodb+srv://${user}:${pw}@cluster0-yznr0.mongodb.net/${db}?retryWrites=true&w=majority`;
const connOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.use((req, res, next) => {
  const time = utils.getTimeStamp();
  const msg = `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}] - TimeStamp:[${time}]`;
  console.log(msg);
  next();
});

!isProduction && app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', wordRouter);

const errHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ NonDefaultErrorHandler: err.stack });
};

app.use(errHandler);

if (isProduction) {
  app.listen(() => {
    console.log('Express Listening');
  });
} else {
  app.listen(port, () => {
    console.log('Express Listening');
  });
}

mongoose
  .connect(mongoAtlasConnectionString, connOptions)
  .then(() => {
    console.log('Mongoose connected');
  })
  .catch((err) => {
    console.log('Mongoose connection error');
    console.log(err);
  });
