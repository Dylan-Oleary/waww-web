const express = require("express");
const app = express();

const movieRoutes = require("./movies");
const userRoutes = require("./users");
const sessionsRoutes = require("./sessions");

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);
app.use("/", sessionsRoutes);

module.exports = app;