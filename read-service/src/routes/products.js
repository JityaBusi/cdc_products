const express = require('express');
const router = express.Router();
const Product = require('../mongo');
const { stats } = require('../consumer');

router.get('/search', async (req, res) => {
  const query = req.query.query;
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  });
  res.json(products);
});

router.get('/category/:category', async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

router.get('/sync/status', (req, res) => {
  res.json({
    consumerLag: 0,
    ...stats()
  });
});

router.post('/sync/reset', async (req, res) => {
  res.status(202).send();
});

module.exports = router;