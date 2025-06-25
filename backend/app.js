const express = require('express');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const authRouter  = require('./routes/auth');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(morgan('combined')); 
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080']
}));

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
