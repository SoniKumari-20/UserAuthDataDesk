const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  productName: String,
  price: String,
  color: String,
  size: String,
  company: String,
});
module.exports = mongoose.model('products', ProductSchema)