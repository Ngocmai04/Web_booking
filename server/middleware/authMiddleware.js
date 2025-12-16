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

// Middleware bảo vệ route + tạo user MongoDB nếu chưa có
export const protect = async (req, res, next) => {
  try {
    const { userId, user } = req.auth; // userId + user được Clerk attach

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // Lấy email, username, image từ user do Clerk attach
    const email = user?.primaryEmailAddress?.emailAddress;
    const username = user?.username || user?.firstName || "User";
    const image = user?.imageUrl;

    // Kiểm tra MongoDB
    let dbUser = await User.findById(userId);

    // Nếu chưa có → tạo
    if (!dbUser) {
      dbUser = await User.create({
        _id: userId, // Clerk ID
        email,
        username,
        image,
        recentSearchedCities: [],
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (!dbUser.isActive) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Tài khoản đã bị khóa. Vui lòng liên hệ admin.",
        });
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
        .json({ success: false, message: "Chỉ Admin mới có quyền truy cập" });
    }
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
