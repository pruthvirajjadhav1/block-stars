const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const coinRoutes = require('./routes/coinRoutes');
const app = express();
require("dotenv").config();
const port = process.env.PORT;

// This will connect with DB
//connectWithDb();


// Middlewares
app.use(express.json());
app.use(cors()); 

// Routes
app.use('/api', coinRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
