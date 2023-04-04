const User = require('../models/user');

// middleware function kiểm tra số lượng sản phẩm trong giỏ hàng
module.exports = async (req, res, next) => {
  const userId = req.cookies.userId;

  try {
    const user = await User.findById(userId).populate('cart.items.productId');
    const products = user.cart.items;

    // Kiểm tra số lượng sản phẩm trong giỏ hàng
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      if (product.quantity > product.productId.count) {
        const error = new Error(
          `${product.productId.name} không đủ số lượng trong kho`
        );
        error.statusCode = 403;
        throw error;
      }
    }

    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
