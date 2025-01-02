require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').createServer(app);

app.use(cors({ origin: '*' }));

const connectDb = require('./configs/db');
connectDb();

const routes = require('./routes');
const { logger } = require('./utils');

app.set('views', path.join(__dirname, 'public/mailTemplate'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

const port = process.env.PORT || 3000;

http.listen(port, () => {
    logger.info(`Server Started in port : ${port}!`);
});

module.exports = app;
