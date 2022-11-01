const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  stock: {
    type: Number,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  description: {
    type: String,
  },
  imagepath: {
    type: Array,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
