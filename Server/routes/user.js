const express = require('express');

const isAuth = require('../middleware/is-auth');
const checkCartQuantity = require('../middleware/check-cart-quantity');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/info', isAuth, userController.getUserInfo);

router.patch('/info', isAuth, userController.updateUserInfo);

router.get('/cart', userController.getCart);

router.post('/cart/add', isAuth, userController.postAddCart);

router.delete('/cart/:productId', isAuth, userController.deleteProductFromCart);

router.post(
  '/create-order',
  isAuth,
  checkCartQuantity,
  userController.postOrder
);

router.get('/orders', isAuth, userController.getOrders);

router.get('/orders/:orderId', isAuth, userController.getOrder);

router.get('/order/ejs-mail', isAuth, userController.getOrderEjsView);

module.exports = router;
