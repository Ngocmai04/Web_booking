import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";

import clerkWebhooks from "./controllers/clerkWebhooks.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

dotenv.config();
connectDB();
connectCloudinary();

const app = express();

/* ================== 1. STRIPE WEBHOOK (RAW BODY – PHẢI ĐẦU TIÊN) ================== */
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* ================== 2. CORS ================== */
app.use(
  cors({
    origin: [
      "https://hotel-booking-iota-weld.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://paradisehotel-snowy.vercel.app",
      "https://hotel-rxyj.onrender.com",
      "https://web-booking-9v4g.vercel.app"
    ],
    credentials: true,
  })
);

app.options("*", cors());

/* ================== 3. BODY PARSER ================== */
app.use(express.json());

/* ================== 4. CLERK AUTH (PHẢI TRƯỚC ROUTES CẦN AUTH) ================== */
app.use(clerkMiddleware());

/* ================== 5. PUBLIC ROUTES ================== */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/ratings", ratingRouter);

/* ================== 6. PROTECTED ROUTES ================== */
app.use("/api/user", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);

/* ================== 7. CLERK WEBHOOK ================== */
app.use("/api/clerk", clerkWebhooks);

/* ================== 8. START SERVER ================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
