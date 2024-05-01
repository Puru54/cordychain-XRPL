const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/register', productController.registerProduct);
router.get('/:productId', productController.retrieveProduct);

module.exports = router;
