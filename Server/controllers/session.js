const { validationResult } = require('express-validator');

const io = require('../socket');
const Session = require('../models/session');

// get tất cả session
exports.getSessions = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 8;
  try {
    const totalItems = await Session.find().countDocuments();

    // Tìm tất cả Session
    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // trả về res
    res.status(200).json({
      message: 'Fetched sessions successfully.',
      sessions: sessions,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Tìm 1 session qua id
exports.getChatSession = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    // Tìm Session theo id
    const session = await Session.findById(roomId);
    if (!session) {
      const error = new Error('Could not find session.');
      error.statusCode = 404;
      throw error;
    }

    // trả về res
    res.status(200).json({ message: 'Session fetched.', session: session });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postNewSession = async (req, res, next) => {
  const errors = validationResult(req);

  const userId = req.body.userId;
  const messageContent = req.body.message;

  // create session in db
  try {
    // nếu req.body empty trả về lỗi (errors tồn tại)
    if (!errors.isEmpty()) {
      const error = new Error(
        errors.errors[0].msg.toString() ||
          'Validation failed, entered data is incorrect.'
      );
      error.statusCode = 422;
      throw error;
    }

    // Tạo đối tượng Session mới
    const session = new Session({
      messages: [{ content: messageContent, sender: userId }], // Thêm tin nhắn và thông tin người gửi vào session
    });

    // Lưu lại db
    await session.save();

    // Thêm socket io 'create'
    io.getIO().emit('messages', {
      action: 'create',
      session: session,
    });

    // trả về res
    res.status(201).json({
      message: 'Session created successfully!',
      roomId: session._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Thêm mess vào session có sẵn
exports.postMessToSession = async (req, res, next) => {
  const errors = validationResult(req);

  const userId = req.body.userId;
  const roomId = req.body.roomId;
  const messageContent = req.body.message;
  const isChatStaff = Boolean(req.body.isChatStaff);

  // create session in db
  try {
    // nếu req.body empty trả về lỗi (errors tồn tại)
    if (!errors.isEmpty()) {
      const error = new Error(
        errors.errors[0].msg.toString() ||
          'Validation failed, entered data is incorrect.'
      );
      error.statusCode = 422;
      throw error;
    }

    const newMessage = {
      content: messageContent,
      sender: userId,
      isChatStaff: isChatStaff,
    };
    // Cập nhật trường 'messages' trong bản ghi tương ứng với 'roomId'
    const session = await Session.findByIdAndUpdate(
      roomId,
      {
        $push: {
          messages: newMessage,
        },
        $set: {
          active: messageContent !== '/end', // set active to false if messageContent is "/end"
        },
      },
      { new: true } // { new: true } để bảo đảm rằng findByIdAndUpdate trả về bản ghi đã được cập nhật mới nhất
    );

    // Thêm socket io 'add-mess'
    io.getIO().emit(roomId, {
      action: 'add-mess',
      messages: session.messages,
      content: messageContent,
    });

    if (messageContent !== '/end') {
      // trả về res
      res.status(200).json({
        message: 'Message added to session successfully!',
      });
    } else {
      res.status(200).json({ message: 'Session ended successfully!' });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
