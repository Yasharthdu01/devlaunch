// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend running 🚀");
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'DevLaunch API running' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});