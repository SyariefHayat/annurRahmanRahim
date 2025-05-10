require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const path = require("path");
const express = require("express");
const routes = require("./routes/index.route")

const { API_PORT, MONGO_URL } = process.env;

const app = express();
const PORT = API_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(MONGO_URL).catch((error) => {
    if (error) {
        console.log("Failed connect to MongoDB");
        throw error;
    }
    console.log("Connected to MongoDB");
})

app.use(routes);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

module.exports = app;