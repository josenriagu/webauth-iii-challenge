const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

const mw = require('./data/helpers/middleware');
const authRouter = require('./auth/authRouter');
const mainRouter = require('./main/mainRouter');

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/main', mw.restrict, mainRouter);
server.use('/api/auth', mw.validateUser, authRouter);

module.exports = server;