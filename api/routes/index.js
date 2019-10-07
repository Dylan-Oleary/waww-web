const express = require("express");
const app = express();

const genreRoutes = require("./genres");
const movieRoutes = require("./movies");
const searchRoutes = require("./search");
const userRoutes = require("./users");
const sessionsRoutes = require("./sessions");

app.use("/genres", genreRoutes);
app.use("/movies", movieRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/", sessionsRoutes);

module.exports = app;