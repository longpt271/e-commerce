const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const isStaff = require('../middleware/is-staff');

const sessionController = require('../controllers/session');

const router = express.Router();

// get all session
router.get('/', isAuth, isStaff, sessionController.getSessions);

// lấy session chat qua id
router.get('/chat/:roomId', isAuth, sessionController.getChatSession);

// route tạo mới session
router.put(
  '/chat/new',
  [body('message').notEmpty().withMessage('message không được để trống!')],
  isAuth,
  sessionController.postNewSession
);

// route thêm mới mess vào session
router.post(
  '/chat/add-mess',
  [
    body('message').notEmpty().withMessage('message không được để trống!'),
    body('roomId').notEmpty().withMessage('roomId không được để trống!'),
  ],
  isAuth,
  sessionController.postMessToSession
);

module.exports = router;
