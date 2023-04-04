const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const phone = req.body.phone;
  try {
    // nếu req.body empty trả về lỗi
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    // Mã hóa password
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
      fullName: fullName,
      phone: phone,
    });

    // Lưu lại db
    const result = await user.save();

    // trả về res
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

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
    loadedUser = user;

    // mã hóa và so sánh xem có trùng password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    // trả về res cookie để xác định user nào đăng nhập cho api
    const maxAgeMilliseconds = 60 * 60 * 1000; // 60 minutes = 3.600.000 milliseconds
    res.cookie('userId', loadedUser._id.toString(), {
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
        fullName: loadedUser.fullName,
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
