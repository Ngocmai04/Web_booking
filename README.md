# 🛍️ Web Booking Hotel

Dự án Fullstack  sử dụng **React 19**, **Tailwind CSS v4** cho Frontend và **Node.js Express** cho Backend.
Đã tích hợp sẵn xác thực **Clerk**, thanh toán **Stripe**, và upload ảnh **Cloudinary**.

---

## 🚀 Công Nghệ Sử Dụng

### 🖥️ Client (Frontend)
- Core: **React 19**, **Vite 6**
- Styling: **Tailwind CSS v4** (sử dụng plugin `@tailwindcss/vite`)
- Routing: **React Router DOM v7**
- Auth: **Clerk React SDK** (`@clerk/clerk-react`)
- HTTP: **Axios**
- UI/UX: **React Hot Toast** (Thông báo), **Lucide React** (Icons)

---

### ⚙️ Server (Backend)
- Runtime: **Node.js** (ES Modules – `type: module`)
- Framework: **Express.js v5**
- Database: **MongoDB & Mongoose**
- Auth & Webhooks: **Clerk Express**, **Svix** (Webhook verification)
- Payment: **Stripe SDK**
- Upload: **Cloudinary & Multer**
- Email: **Nodemailer**

---

## 🛠️ Hướng Dẫn Cài Đặt (Local Setup)

### 1. Yêu cầu hệ thống
- Node.js: **18.x trở lên**
- MongoDB: MongoDB Compass hoặc MongoDB Atlas

---

### 2. Cài đặt Dependencies

#### Bước 1: Cài đặt cho Server
```bash
cd server
npm install
```

----
## 🔑 Cấu Hình Biến Môi Trường (.env)
- Bạn cần tạo 2 file .env riêng biệt cho Server và Client.
### 1. Tại thư mục server/Tạo file .env và điền các key sau:
```bash
# --- Server Config ---
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db_name>

# --- Authentication (Clerk) ---
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# --- Payment (Stripe) ---
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# --- Image Upload (Cloudinary) ---
CLOUDINARY_CLOUD_NAME=ten_cloud_cua_ban
CLOUDINARY_API_KEY=api_key_cua_ban
CLOUDINARY_API_SECRET=api_secret_cua_ban

# --- Email Service (Optional) ---
EMAIL_USER=email_cua_ban@gmail.com
EMAIL_PASS=mat_khau_ung_dung

```

### 2. Tại thư mục client/Tạo file .env và điền các key sau (Lưu ý prefix VITE_):
```bash
# --- Clerk Auth ---
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# --- API Backend URL ---
VITE_API_URL=http://localhost:3000

```
-----------------------------

## ▶️ Cách Chạy Dự ÁnBạn cần mở 2 terminal riêng biệt.
Terminal 1: Chạy Server (Backend)cd server
```bash
   npm run server
```
# Server sẽ chạy tại http://localhost:5000
# Sử dụng 'nodemon' để tự động restart khi sửa code
Terminal 2: Chạy Client (Frontend)cd client
```bash
npm run dev
# Client mặc định chạy tại http://localhost:5173 (có thể thay đổi port trong vite.config.js hoặc qua biến môi trường nếu bị trùng port)
```
