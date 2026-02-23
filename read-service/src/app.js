require('dotenv').config();
const express = require('express');
const { startConsumer } = require('./consumer');
require('./mongo');

const app = express();
app.use(express.json());
app.use('/api', require('./routes/products'));

app.listen(8081, async () => {
  console.log('Read Service running on port 8081');
  await startConsumer();
});