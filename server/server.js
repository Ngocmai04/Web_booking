import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";
import ratingRouter from "./routes/ratingRoutes.js";

dotenv.config();
connectDB();
connectCloudinary();

const app = express();

/* ================== 1. STRIPE WEBHOOK (PHẢI ĐẦU TIÊN) ================== */
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
      "https://paradisehotel-snowy.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* ================== 3. BODY PARSER ================== */
app.use(express.json());

/* ================== 4. ROUTES KHÔNG CẦN AUTH ================== */
app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

app.use("/api/ratings", ratingRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);

/* ================== 5. AUTH (CHỈ CHO ROUTE CẦN) ================== */
app.use(clerkMiddleware());

app.use("/api/user", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/clerk", clerkWebhooks);

/* ================== 6. START SERVER ================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
