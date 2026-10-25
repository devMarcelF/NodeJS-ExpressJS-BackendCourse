import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  // Verify movie exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Check if already added
  const existingInWatchList = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchList) {
    return res.status(400).json({ error: "Movie already in the watchlist" });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      watchlistItem,
    },
  });
};

const updateWatchList = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchListItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchListItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can update
  if (watchListItem.userId != req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  // Build update data
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update watchlist item
  const updatedItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updatedItem,
    },
  });
};

const removeFromWatchList = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchListItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchListItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only onwer can delete
  if (watchListItem.userId != req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  await prisma.watchlistItem.delete({
    where: { id: req.params.id },
  });

  res
    .status(200)
    .json({ status: "Success", message: "Item removed from watchlist" });
};

export { addToWatchList, removeFromWatchList, updateWatchList };
