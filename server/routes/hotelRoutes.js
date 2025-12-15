import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHotels, getOwnerHotels, registerHotel, updateHotel, deleteHotel } from "../controllers/hotelController.js";

const router = express.Router();

router.post("/", protect, registerHotel);
router.get("/", getHotels);
router.get("/owner", protect, getOwnerHotels);
router.put("/:id", protect, updateHotel);
router.delete("/:id", protect, deleteHotel);

export default router;
