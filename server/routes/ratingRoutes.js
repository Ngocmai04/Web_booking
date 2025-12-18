import express from 'express';
import { 
  getRating, 
  createRating, 
  updateRating, 
  deleteRating,
  getAverageRatings 
} from '../controllers/ratingController.js';
import { protect } from '../middleware/authMiddleware.js';

const ratingRouter = express.Router();

// Public routes - Không cần authentication
ratingRouter.get('/', getRating);
ratingRouter.get('/average', getAverageRatings);

// Protected routes - Cần Clerk authentication
ratingRouter.post('/', protect, createRating);
ratingRouter.put('/:id', protect, updateRating);
ratingRouter.delete('/:id', protect, deleteRating);

export default ratingRouter;