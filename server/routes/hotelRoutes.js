import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHotels, getOwnerHotels, registerHotel } from "../controllers/hotelController.js";

const router = express.Router();

router.post("/", protect, registerHotel);
router.get("/", getHotels);
router.get("/owner", protect, getOwnerHotels);

export default router;
