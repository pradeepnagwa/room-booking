const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./routes');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const database = require('./helper/database');
const { initSocket } = require('./helper/socket');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(helmet())
app.use(cors())

database.connect();
database.initModels();

const server = http.createServer(app);
initSocket(server);
app.use('/api', routes)

server.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT)
})

module.exports = app;