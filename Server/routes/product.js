const express = require('express');
const isAuth = require('../middleware/is-auth');

const productController = require('../controllers/product');
const productSearchController = require('../controllers/productSearch');

const router = express.Router();

// GET /api/products
router.get('/', productController.getProducts);

router.get('/find/:productId', productController.getProduct);

router.post('/related', productController.postRelatedProducts);

router.get('/search', productSearchController.getSearchProducts);

module.exports = router;
