const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controller/errorController');
const authRoute = require('./routes/authRoute');
const userRoute = require("./routes/userRoute"); 
const urlRoute = require('./routes/urlRoute');
const urlController = require('./controller/urlController');
const app = express();
app.use(express.json());


if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}



app.use("/users", userRoute);
app.use('/auth',authRoute);
app.use('/url', urlRoute);
app.get('/:shortCode', urlController.redirectUrl);
console.log('app.js working');

app.use(globalErrorHandler);

module.exports = app; 