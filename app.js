const express = require('express');
const testRoutes = require('./routes/testRoutes');
const authRoute = require('./routes/authRoute');
const app = express();
app.use(express.json());





app.use('/auth',authRoute);
app.use('/test',testRoutes);
console.log('app.js working');

module.exports = app; 