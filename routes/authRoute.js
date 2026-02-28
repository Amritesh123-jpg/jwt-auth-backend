const express = require('express');
const authController = require('../controller/authController');
const route = express.Router();



route.post('/signup',authController.signUp);
route.post('/login',authController.login);

console.log("all ready");

module.exports = route;