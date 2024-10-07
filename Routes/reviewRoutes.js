const express = require('express');

const authController = require('../Controllers/authControllers');

const reviewController = require('../Controllers/reviewControllers');

const router = express.Router({ mergeParams: true });

// POST/2342sa232/reviews
// POST/reviews
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .get(reviewController.getReview);

module.exports = router;
