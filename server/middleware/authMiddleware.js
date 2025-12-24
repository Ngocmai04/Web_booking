// import User from "../models/User.js";

// // Middleware to check if user is authenticated
// export const protect = async (req, res, next) => {
//   const { userId } = req.auth;
//   if (!userId) {
//     res.json({ success: false, message: "not authenticated" });
//   } else {
//     const user = await User.findById(userId);
//     req.user = user;
//     next();
//   }
// };

import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

// Middleware bảo vệ route + tạo user MongoDB nếu chưa có
export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Fetch full user data from Clerk API
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (clerkError) {
      console.error("Failed to fetch Clerk user:", clerkError.message);
    }

    // Get email, username, image from Clerk API response
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    const username = clerkUser?.username || clerkUser?.firstName || "User";
    const image = clerkUser?.imageUrl;

    console.log('🔍 Clerk User Data:', { userId, email, username });

    // Check MongoDB
    let dbUser = await User.findById(userId);

    // If not exists → create
    if (!dbUser) {
      dbUser = await User.create({
        _id: userId,
        email,
        username,
        image,
        recentSearchedCities: [],
      });
      console.log('New user created:', userId, email);
    } else if (email && dbUser.email !== email) {
      // Update email if changed
      dbUser.email = email;
      await dbUser.save();
      console.log('User email updated:', userId, email);
    }

    req.user = dbUser;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Middleware chỉ cho phép Admin truy cập
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admins only." });
    }
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
