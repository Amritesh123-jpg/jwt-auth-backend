const express = require('express');
const testRoutes = require('./routes/testRoutes');
const authRoute = require('./routes/authRoute');
const userRoute = require("./routes/userRoute"); 
const app = express();
app.use(express.json());




app.use("/users", userRoute);
app.use('/auth',authRoute);
app.use('/test',testRoutes);
console.log('app.js working');

module.exports = app; 