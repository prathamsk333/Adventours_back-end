const express = require('express');

const router = express.Router();

const tourController = require('../Controllers/tourControllers');

const authController = require('../Controllers/authControllers');

router.get('/mybookings/getMyBookings', authController.protect, tourController.getMyTours);

router.route('/:slug').get(authController.protect, tourController.getTourView);



module.exports = router;
