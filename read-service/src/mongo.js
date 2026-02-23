const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const productSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  price: Number,
  category: String,
  stock: Number,
  deleted_at: Date
});

module.exports = mongoose.model('Product', productSchema);