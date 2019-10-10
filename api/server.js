require("dotenv").config();

//Connect to MongoDB
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI, {
    auth:{
       user: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(`ERROR: ${err}`));
mongoose.set('useFindAndModify', false);

//Initialize Express application
const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//CONFIG
app.use(cors());

app.use(cookieParser());

//Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const routes = require("./routes/index");
app.use("/api", routes);

// Serve any static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const port = process.env.NODE_ENV === "production" ? 80 : 4000 
app.listen(port, () => console.log(`Server is up and running on ${port}`));