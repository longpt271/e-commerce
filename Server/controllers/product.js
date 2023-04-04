const Product = require('../models/product');
const User = require('../models/user');

// get tất cả product
exports.getProducts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 8;
  try {
    const totalItems = await Product.find().countDocuments();

    // Tìm tất cả Product
    const products = await Product.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // trả về res
    res.status(200).json({
      message: 'Fetched products successfully.',
      products: products,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get 1 product
exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    // Tìm Product theo id
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    // trả về res
    res.status(200).json({ message: 'Product fetched.', product: product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get product liên quan với category của 1 product
exports.postRelatedProducts = async (req, res, next) => {
  const productId = req.body._id;
  const category = req.body.category;

  const currentPage = req.query.page || 1;
  const perPage = 6;
  try {
    // Tìm tất cả Product
    const products = await Product.find({
      category: category,
      _id: { $ne: productId },
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // trả về res
    res.status(200).json({
      message: 'Fetched related products successfully.',
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
