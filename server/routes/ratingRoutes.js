import express from "express";
import {
  getRating,
  createRating,
  updateRating,
  deleteRating,
  getAverageRatings,
  getRandomRatings,
} from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const ratingRouter = express.Router();

// Public routes - Không cần authentication
// Specific routes MUST come before generic routes
ratingRouter.get("/testimonials/random", getRandomRatings);
ratingRouter.get("/average", getAverageRatings);
ratingRouter.get("/", getRating);

// Protected routes - Cần Clerk authentication
ratingRouter.post("/", protect, createRating);
ratingRouter.put("/:id", protect, updateRating);
ratingRouter.delete("/:id", protect, deleteRating);

export default ratingRouter;
