const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithinRange);

router.route('/distances/:latlng/unit/:unit').get(tourController.getNearTours);

router.route('/destination/:destinationId').get(tourController.getDestinations);

// axios.get('https://localhost:8000/api/v1/tours/')

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .put(tourController.updateTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
