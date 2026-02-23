require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/products', require('./routes/products'));

app.listen(8080, () => {
  console.log('Write Service running on port 8080');
});