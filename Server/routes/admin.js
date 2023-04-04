const express = require('express');
const { body } = require('express-validator');

// middleware
const isAdmin = require('../middleware/is-admin');
const isAuth = require('../middleware/is-auth');
const isStaff = require('../middleware/is-staff');
const upload = require('../middleware/use-multer');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/auth/login', adminController.login);

router.get('/users', isAuth, isAdmin, adminController.getUsers);

router.patch('/users/info', isAuth, isAdmin, adminController.updateUserRole);

router.get('/orders', isAuth, isStaff, adminController.getOrders);

router.patch(
  '/orders/delivery',
  isAuth,
  isStaff,
  adminController.updateOrderDelivery
);

router.patch(
  '/orders/status',
  isAuth,
  isStaff,
  adminController.updateOrderStatus
);

router.get('/dashboard', isAuth, isStaff, adminController.getDashboard);

// POST /api/products/new
router.post(
  '/products/new',
  upload.array('uploadImages', 4),
  [
    body('name').notEmpty().withMessage('Name không được để trống!'),

    body('price')
      .notEmpty()
      .withMessage('Giá không được để trống')
      .isFloat({ min: 0 })
      .withMessage('Giá trị Price không được âm'),
    body('count')
      .notEmpty()
      .withMessage('Giá không được để trống')
      .isFloat({ min: 0 })
      .withMessage('Giá trị Count không được âm'),

    body('category').notEmpty().withMessage('Danh mục không được để trống'),
    body('short_desc').notEmpty().withMessage('Short desc không được trống!'),
    body('long_desc').notEmpty().withMessage('Long desc không được để trống!'),
  ],
  isAuth,
  isAdmin,
  adminController.postNewProduct
);

router.put(
  '/products/edit',
  [
    body('name').notEmpty().withMessage('Name không được để trống!'),
    body('price').notEmpty().withMessage('Giá không được để trống'),
    body('category').notEmpty().withMessage('Danh mục không được để trống'),
    body('short_desc').notEmpty().withMessage('Short desc không được trống!'),
    body('long_desc').notEmpty().withMessage('Long desc không được để trống!'),
  ],
  isAuth,
  isAdmin,
  adminController.updateProduct
);

router.delete(
  '/products/delete/:productId',
  isAuth,
  isAdmin,
  adminController.deleteProduct
);

module.exports = router;
