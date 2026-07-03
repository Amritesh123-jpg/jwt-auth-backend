const Url = require('../model/urlModel');
const catchAsync = require('../utils/catchAsync');

exports.createShortUrl = catchAsync(async (req, res, next) => {
  const { originalUrl } = req.body;
  
  //Generate a short URL code (you can use any method you prefer)
  const shortCode = Math.random().toString(36).substring(2, 8); // Example: random 6-character code

  // Create a new URL document in the database
  const newUrl = await Url.create({
   
    originalUrl,
    shortCode,
    user: req.user.id, 

  });

  res.status(201).json({
    status: 'success',
    data: {
      url: newUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`, // Construct the short URL
    },
  });
})