import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMovies = async (req, res) => {
  console.log("Fetching movies");
  const movies = await prisma.movie.findMany();
  res.json({ status: "success", data: movies });
};

const getMovieById = async (req, res) => {
  const movie = await prisma.movie.findUniqueOrThrow({
    where: { id: req.params.id },
  });
  res.json({ status: "success", data: movie });
};

const createMovie = async (req, res) => {
  const movie = await prisma.movie.create({ data: req.body });
  res.status(201).json({ status: "success", data: movie });
};

const updateMovie = async (req, res) => {
  const movie = await prisma.movie.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ status: "success", data: movie });
};

const deleteMovie = async (req, res) => {
  await prisma.movie.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

export { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };