require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const routes = require("./routes/index");

mongoose.connect(process.env.DB_URI, {
    auth:{
       user: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(err => console.log(`ERROR: ${err}`));

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use("/api", routes);

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const port = process.env.NODE_ENV === "production" ? 80 : 4000 
app.listen(port, () => console.log(`Server is up and running on ${port}`));