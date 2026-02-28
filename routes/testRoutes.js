const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
  res.send('test route  working');
  console.log('all okk buddy');
});
// console.log('test route working');

module.exports = router;