const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

// Xử lý login admin
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    // Tìm user có email trùng
    const user = await User.findOne({ email: email });

    // Nếu k có trả về lỗi
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    // chỉ cho phép role admin và chat-staff truy cập
    if (user.role !== 'admin' && user.role !== 'chat-staff') {
      const error = new Error('You are not authorized to login!');
      error.statusCode = 403;
      throw error;
    }

    loadedUser = user;

    // mã hóa và so sánh xem có trùng password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    // trả về res
    const maxAgeMilliseconds = 60 * 60 * 1000; // 60 minutes
    res.cookie('userIdAdmin', loadedUser._id.toString(), {
      maxAge: maxAgeMilliseconds,
      // httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    res.status(200).json({
      message: 'Login successfully!',
      user: {
        userId: loadedUser._id.toString(),
        role: loadedUser.role,
        maxAge: maxAgeMilliseconds,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all Dashboard data
exports.getDashboard = async (req, res, next) => {
  try {
    // Count tổng số user/order
    const totalUser = await User.find().countDocuments();
    const totalOrder = await Order.find().countDocuments();

    // Tính tổng doanh thu
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'done' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalMoney' } } },
    ]);

    const finalTotalRevenue = totalRevenue[0]
      ? totalRevenue[0].totalRevenue
      : 0;

    // Trung bình doanh thu từng tháng
    const avgMonths = [];
    const printAvgRevenueByMonth = result => {
      result.forEach(item => {
        avgMonths.push({ month: item._id, avgRevenue: item.avgRevenue });
      });
    };

    await Order.aggregate([
      { $match: { status: 'done' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          avgRevenue: { $avg: '$totalMoney' },
        },
      },
    ]).then(printAvgRevenueByMonth);

    // trả về res
    res.status(200).json({
      message: 'Dashboard fetched.',
      totalRevenue: finalTotalRevenue,
      avgMonths: avgMonths,
      totalUser: totalUser,
      totalOrder: totalOrder,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get tất cả Users
exports.getUsers = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 8;
  try {
    const totalItems = await User.find().countDocuments();

    // Tìm tất cả User
    const users = await User.find()
      .select({ password: 0 }) // loại password ra khỏi kq find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // trả về res
    res.status(200).json({
      message: 'Fetched users successfully.',
      users: users,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// sửa role user
exports.updateUserRole = async (req, res, next) => {
  const cookiesUserId = req.cookies.userIdAdmin; // thông tin user trả về từ cookie req
  const userId = req.body.userId;
  const newRole = req.body.role;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // kiểm tra nhận đúng role không
    if (newRole !== 'admin' && newRole !== 'chat-staff' && newRole !== 'user') {
      const error = new Error('Wrong new role.');
      error.statusCode = 403;
      throw error;
    }

    if (newRole !== 'admin') {
      // kiểm tra có ít nhất 1 người admin
      currentUser = await User.findOne({ _id: cookiesUserId }).select('role'); // select role của user cookie

      hasOneAdmin = await User.find({ role: 'admin' }).countDocuments(); // lấy ra số lượng use là 'admin'

      // nếu user cookie là admin và chỉ có 1 admin trong db
      // => ô này k được đổi role
      if (
        cookiesUserId === userId &&
        currentUser.role === 'admin' &&
        +hasOneAdmin === 1
      ) {
        const error = new Error('Bạn là admin duy nhất.');
        error.statusCode = 403;
        throw error;
      }
    }

    user.role = newRole;
    await user.save();
    res.status(200).json({ message: 'User role updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// get all orders
exports.getOrders = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 8;

  try {
    // Count tổng số items
    const totalItems = await Order.find().countDocuments();

    // Tìm user, Product theo id kèm sort, page
    const orders = await Order.find()
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

// sửa delivery order
exports.updateOrderDelivery = async (req, res, next) => {
  const orderId = req.body.orderId;
  const newDelivery = req.body.delivery;
  try {
    const order = await Order.findById(orderId);
    // kiểm tra có order k
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    // kiểm tra có new delivery k
    if (!newDelivery) {
      const error = new Error('new Delivery not found.');
      error.statusCode = 403;
      throw error;
    }

    // kiểm tra có phải waiting hooặc done k
    if (newDelivery !== 'done' && newDelivery !== 'waiting') {
      const error = new Error('wrong Delivery.');
      error.statusCode = 403;
      throw error;
    }

    order.delivery = newDelivery;
    await order.save();
    res.status(200).json({ message: 'Order delivery updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// sửa Status order
exports.updateOrderStatus = async (req, res, next) => {
  const orderId = req.body.orderId;
  const newStatus = req.body.status;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    // kiểm tra có new delivery k
    if (!newStatus) {
      const error = new Error('new Status not found.');
      error.statusCode = 403;
      throw error;
    }

    // kiểm tra có phải waiting hooặc done k
    if (newStatus !== 'done' && newStatus !== 'waiting') {
      const error = new Error('wrong Status.');
      error.statusCode = 403;
      throw error;
    }

    order.status = newStatus;
    await order.save();
    res.status(200).json({ message: 'Order status updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// post tạo 1 product
exports.postNewProduct = async (req, res, next) => {
  const errors = validationResult(req);

  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;
  const count = req.body.count;
  const images = req.files || [];
  // console.log(images);

  // create product in db
  try {
    // nếu k đủ 4 ảnh và errors tồn tại
    if (images?.length !== 4 || !errors.isEmpty()) {
      // Xóa toàn bộ ảnh vừa lưu vào 'public/images'
      await images.forEach(file => {
        clearImage(file.path);
      });
    }

    // nếu req.body empty trả về lỗi (errors tồn tại)
    if (!errors.isEmpty()) {
      const error = new Error(
        errors.errors[0].msg.toString() ||
          'Validation failed, entered data is incorrect.'
      );
      error.statusCode = 422;
      throw error;
    }

    // nếu images ít hơn 4 ảnh trả về lỗi
    if (images?.length !== 4) {
      const error = new Error('Please pick 4 images fo product.');
      error.statusCode = 422;
      throw error;
    }

    const img1 = images[0].path.replace(/\\/g, '/');
    const img2 = images[1].path.replace(/\\/g, '/');
    const img3 = images[2].path.replace(/\\/g, '/');
    const img4 = images[3].path.replace(/\\/g, '/');
    const product = new Product({
      name: name,
      price: price,
      category: category,
      count: count,
      img1: img1,
      img2: img2,
      img3: img3,
      img4: img4,
      short_desc: short_desc,
      long_desc: long_desc,
    });

    // Lưu lại db
    await product.save();

    // trả về res
    res.status(201).json({ message: 'Product created successfully!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// sửa thông tin Product
exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);

  const prodId = req.body.prodId; // thông tin Product trả về từ cookie req
  const newName = req.body.name;
  const newPrice = req.body.price;
  const newCount = req.body.count;
  const newCategory = req.body.category;
  const newShortDesc = req.body.short_desc;
  const newLongDesc = req.body.long_desc;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!errors.isEmpty()) {
      const error = new Error(
        errors.errors[0].msg.toString() ||
          'Validation failed, entered data is incorrect.'
      );
      error.statusCode = 422;
      throw error;
    }

    product.name = newName;
    product.price = newPrice;
    product.count = newCount;
    product.category = newCategory;
    product.short_desc = newShortDesc;
    product.long_desc = newLongDesc;
    await product.save();
    res.status(200).json({ message: 'Product updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Xóa 1 product
exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);

    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    // Xóa toàn bộ ảnh
    clearImage(product.img1);
    clearImage(product.img2);
    clearImage(product.img3);
    clearImage(product.img4);

    await Product.findByIdAndRemove(prodId);

    res.status(200).json({ message: 'Deleted product.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Hàm giúp xóa ảnh khỏi folder
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
