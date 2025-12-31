import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings, stripePayment, confirmBooking, resendConfirmation, verifyPayment } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);
bookingRouter.post('/stripe-payment', protect, stripePayment);
bookingRouter.post('/verify-payment', protect, verifyPayment);
bookingRouter.get('/confirm/:bookingId/:token', confirmBooking);
bookingRouter.post('/resend-confirmation', protect, resendConfirmation);

export default bookingRouter;