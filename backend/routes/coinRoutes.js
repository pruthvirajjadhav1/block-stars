const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/coin-price', coinController.getCoinPrice);
router.get('/sse', coinController.sse);

module.exports = router;
