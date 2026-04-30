const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bookRoutes = require('./routes/books');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(3333, () => {
  console.log('Server running on port 3333');
});