const express = require('express');
const {
  checkReviewValidity,
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getReviewsByTour,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/tours/:tourId', getReviewsByTour);

router.route('/').get(getAllReviews).post(checkReviewValidity, createReview);

router
  .route('/:id')
  .get(getReview)
  .put(updateReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
