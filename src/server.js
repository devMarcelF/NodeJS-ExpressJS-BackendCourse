import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======= API Routes =========
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchList", watchlistRoutes);

// ======= Error handling (must be after routes) =========
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});