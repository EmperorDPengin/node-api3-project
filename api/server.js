const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

// remember express by default cannot parse JSON in request bodies
server.use(express.json());
server.use(helmet);
server.use(morgan('dev'));

// global middlewares and the user's router need to be connected here
// server.use('/api/users', usersRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.get('*', (req, res) => {
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found`});
})

module.exports = server;
