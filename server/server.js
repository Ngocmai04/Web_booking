import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
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

connectDB();
connectCloudinary();
dotenv.config();

const app = express();

// 1. CORS
app.use(
  cors({
    origin: [
      "https://hotel-booking-iota-weld.vercel.app",
      "http://localhost:5173",
      "https://web-booking-eeb1pa7di-ngocmai04s-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.options(/.*/, cors());

app.use(cors(corsOptions));
app.options("/", cors(corsOptions));

// API to listen to Stripe Webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// 3. Body parser
app.use(express.json());

// 4. Auth
app.use(clerkMiddleware());

// 5. Routes
app.use("/api/clerk", clerkWebhooks);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ratings", ratingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));