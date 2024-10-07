const express = require('express');

const authController = require('../Controllers/authControllers');

const bookingController = require('../Controllers/bookingControllers');

const router = express.Router();

router.post(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getChecoutSession,
);

router.post(
  '/order/validate',
  authController.protect,
  bookingController.validateOrder,
);

module.exports = router;
