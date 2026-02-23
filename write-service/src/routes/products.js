const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { name, price, category, stock } = req.body;
  const result = await db.query(
    `INSERT INTO products (name, price, category, stock)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, price, category, stock]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { name, price, category, stock } = req.body;
  const result = await db.query(
    `UPDATE products SET name=$1, price=$2, category=$3,
     stock=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [name, price, category, stock, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await db.query(
    `UPDATE products SET deleted_at=NOW() WHERE id=$1`,
    [req.params.id]
  );
  res.status(204).send();
});

module.exports = router;