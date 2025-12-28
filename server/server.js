const express = require("express");
const cors = require("cors");
require("dotenv").config();

const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/weather", weatherRoutes);

// Root route để test
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Weather API Server is running on Vercel",
    timestamp: new Date().toISOString()
  });
});

// Health check
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

// QUAN TRỌNG: Export app cho Vercel
module.exports = app;

// Chỉ listen khi chạy local (không phải trên Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server đang chạy trên cổng ${PORT}`);
  });
}