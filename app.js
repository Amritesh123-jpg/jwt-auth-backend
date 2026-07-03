const express = require('express');
const morgan = require('morgan')
const authRoute = require('./routes/authRoute');
const userRoute = require("./routes/userRoute"); 
const app = express();
app.use(express.json());


if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}



app.use("/users", userRoute);
app.use('/auth',authRoute);
console.log('app.js working');

module.exports = app; 