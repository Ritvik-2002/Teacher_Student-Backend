const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connectDB = require('./config/dbConnection');

app.use(express.json());
app.use("/toddle/user", require("./Routes/Userrouter"));
app.use("/toddle/journal", require("./Routes/Journalrouter"));
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
