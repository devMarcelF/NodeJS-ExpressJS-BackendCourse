import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createMovieSchema, updateMovieSchema } from "../validators/movieValidators.js";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

// Protect all routes below this middleware
// Check for the JWT token in the request header
router.use(authMiddleware);

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", validateRequest(createMovieSchema), createMovie);
router.patch("/:id", validateRequest(updateMovieSchema), updateMovie);
router.delete("/:id", deleteMovie);

export default router;