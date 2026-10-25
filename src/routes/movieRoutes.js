import express from "express";
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

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", validateRequest(createMovieSchema), createMovie);
router.patch("/:id", validateRequest(updateMovieSchema), updateMovie);
router.delete("/:id", deleteMovie);

export default router;