require('dotenv').config();
require('express-async-errors');
const express = require('express');
const router = require('./router');
const errorHandler = require('./app/middlewares/errorHandler');
require('./app/services/jobs');

const app = express();

app.use(express.json());

app.use(router);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('Server started'));
