const express = require('express');
const testRoutes = require('./routes/testRoutes');
const authRoute = require('./routes/authRoute');
const app = express();
app.use(express.json());



//app.use('/test',testRoutes);

app.use('/auth',authRoute);
console.log('app.js working');

module.exports = app; 