const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// IMPORT ROUTES
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

// SWAGGER
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/books', bookRoutes);
app.use('/auth', authRoutes);

// SWAGGER ROUTE
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROOT
app.get('/', (req, res) => {
  res.send('API is running...');
});

// START SERVER
app.listen(3333, () => {
  console.log('Server running on port 3333');
});