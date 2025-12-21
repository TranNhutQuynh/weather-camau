const express = require("express");
const cors = require("cors");
require("dotenv").config();

const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

// Render BẮT BUỘC phải lấy đúng PORT này
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/weather", weatherRoutes);

// Health check (Render dùng để kiểm tra service có sống không)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Weather API Server is running" });
});

// Middleware xử lý lỗi
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: "Có lỗi xảy ra!",
    message: error.message,
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Không tìm thấy đường dẫn!" });
});

// Quan trọng: log rõ ràng để Render biết server đã start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server đang chạy trên cổng ${PORT}`);
});
