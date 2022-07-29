const router = require('express').Router();
const bookingController = require('../controllers/bookingController');

router.post('/payments', bookingController.createCheckoutSession);

router.get(
  '/my-bookings/:userId',
  bookingController.myBookings,
  bookingController.getAllBookings
);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .put(bookingController.updateBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
