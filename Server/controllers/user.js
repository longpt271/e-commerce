const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

// sử dụng nodemailer để gửi mail
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const NODEMAILER_API = process.env.NODEMAILER_API;

// tạo transporter xác thực api gửi mail
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: { api_key: NODEMAILER_API },
  })
);

// lấy thông tin của user qua id
exports.getUserInfo = async (req, res, next) => {
  const userId = req.cookies.userId || req.cookies.userIdAdmin; // thông tin user trả về từ cookie req
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const { fullName, phone, email, address, role } = user;

    res.status(200).json({ fullName, phone, email, address, role });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// sửa thông tin user
exports.updateUserInfo = async (req, res, next) => {
  const userId = req.cookies.userId || req.cookies.userIdAdmin; // thông tin user trả về từ cookie req
  const newFullName = req.body.fullName;
  const newPhone = req.body.phone;
  const newAddress = req.body.address;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    user.fullName = newFullName;
    user.phone = newPhone;
    user.address = newAddress;
    await user.save();
    res.status(200).json({ message: 'User updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all cart
exports.getCart = async (req, res, next) => {
  const userId = req.cookies.userId; // thông tin user trả về từ cookie req
  try {
    // Tìm Product theo id
    const user = await User.findById(userId).populate('cart.items.productId');

    const products = user.cart.items;

    // trả về res
    res.status(200).json({ message: 'Cart fetched.', products: products });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// post add product vào cart
exports.postAddCart = async (req, res, next) => {
  const userId = req.cookies.userId; // thông tin user trả về từ cookie req
  const productId = req.body.productId;
  const numAdd = req.body.numAdd;

  try {
    // Tìm user, Product theo id
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    // Nếu k có product trả về lỗi
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    // sử dụng method add to cart
    await user.addToCart(product, numAdd);

    // trả về res
    res.status(200).json({ message: 'Added to Cart.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// xóa 1 product khỏi cart dựa vào id
exports.deleteProductFromCart = async (req, res, next) => {
  const userId = req.cookies.userId; // thông tin user trả về từ cookie req
  const prodId = req.params.productId;

  try {
    // Tìm user, Product theo id
    const user = await User.findById(userId);

    // sử dụng method remove From Cart
    await user.removeFromCart(prodId);

    // trả về res
    res.status(200).json({ message: 'Deleted from Cart.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Tạo order từ thông tin cart đã qua pass được middleware kiểm tra số lượng sản phẩm trong giỏ hàng
exports.postOrder = async (req, res, next) => {
  const userId = req.cookies.userId; // thông tin user trả về từ cookie req

  try {
    // Tìm user, Product theo id
    const user = await User.findById(userId).populate('cart.items.productId');

    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    const orderData = {
      user: {
        userId: userId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
      },
      products: products,
      totalMoney: req.body.totalMoney,
      totalQuantity: req.body.totalQuantity,
    };

    const order = new Order(orderData);

    // Lưu thông tin order
    await order.save();

    // cập nhật số lượng sản phẩm trong kho
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      await Product.findByIdAndUpdate(product.product._id, {
        $inc: { count: -product.quantity },
        // $inc được sử dụng để tăng hoặc giảm một giá trị số  trong một trường cụ thể
      });
    }

    // sử dụng method clear Cart
    await user.clearCart();

    // start--- Gửi mail cho người dùng bằng nodemailer
    const templatePath = path.join(__dirname, '..', 'views', 'order-mail.ejs');
    const template = fs.readFileSync(templatePath, 'utf8'); // Read the EJS template file

    // Tạo đối tượng Date hiện tại
    let currentDate = new Date();

    // Lấy ngày tháng năm hiện tại
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên phải cộng thêm 1
    let year = currentDate.getFullYear();
    // Lấy giờ phút hiện tại
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    // Định dạng chuỗi ngày tháng năm và giờ phút
    let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    // lấy ra tên miền hiện tại (để gán vào ảnh nếu public/images)
    const currentProtocol = req.protocol;
    const currentDomain = req.hostname;
    const currentUrl = currentProtocol + '://' + currentDomain;

    const html = ejs.render(template, {
      ...orderData,
      formattedDate,
      mainApi: currentUrl,
    }); // Render the template with the data

    await transporter.sendMail({
      from: {
        name: 'Ecommerce Mail System',
        address: 'unirotech@hotmail.com',
      },
      to: user.email,
      subject: 'Order succeeded!',
      html: html, // Send the email with the HTML content
    });
    // end--- Gửi mail cho người dùng bằng nodemailer

    // trả về res
    res.status(200).json({ message: 'Created order.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all orders by id
exports.getOrders = async (req, res, next) => {
  const userId = req.cookies.userId || req.cookies.userIdAdmin; // thông tin user trả về từ cookie req
  const currentPage = req.query.page || 1;
  const perPage = 8;

  try {
    // Count tổng số items
    const totalItems = await Order.find({
      'user.userId': userId,
    }).countDocuments();

    // Tìm user, Product theo id kèm sort, page
    const orders = await Order.find({ 'user.userId': userId })
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // trả về res
    res.status(200).json({
      message: 'Orders fetched.',
      orders: orders,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get 1 order
exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    // Tìm order theo id
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Could not find order.');
      error.statusCode = 404;
      throw error;
    }

    // trả về res
    res.status(200).json({ message: 'order fetched.', order: order });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// xem trước mail sẽ gửi với ejs
exports.getOrderEjsView = async (req, res, next) => {
  const userId = req.cookies.userId || req.cookies.userIdAdmin; // thông tin user trả về từ cookie req

  try {
    // Tìm user, Product theo id
    const orders = await Order.find({ 'user.userId': userId });

    const templatePath = path.join(__dirname, '..', 'views', 'order-mail.ejs');
    const template = fs.readFileSync(templatePath, 'utf8'); // Read the EJS template file

    // nếu muốn xem k lỗi thì đổi 'formattedDate' thành 'createdAt'
    const html = ejs.render(template, orders[0]); // Render the template with the data

    // trả về res
    res.send(html);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
