const Url = require("../model/urlModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const QRCode = require("qrcode");
// Create Short URL
exports.createShortUrl = catchAsync(async (req, res, next) => {
  const { originalUrl, customAlias } = req.body;

  // Validate URL
  try {
    new URL(originalUrl);
  } catch (err) {
    return next(new AppError("Please provide a valid URL", 400));
  }

  let shortCode;

  if (customAlias) {
    shortCode = customAlias.trim().toLowerCase();

    const existingUrl = await Url.findOne({ shortCode });

    if (existingUrl) {
      // Alias belongs to another user
      if (existingUrl.user.toString() !== req.user.id) {
        return next(
          new AppError("Custom alias already belongs to another user", 409)
        );
      }

      // Same user but alias still active
      if (!existingUrl.expiresAt || existingUrl.expiresAt > new Date()) {
        return next(
          new AppError("You already have this custom alias", 409)
        );
      }

      // Same user + expired
      await existingUrl.deleteOne();
    }
  } else {
    // Generate unique random code
    do {
      shortCode = Math.random().toString(36).substring(2, 8);
    } while (await Url.findOne({ shortCode }));
  }

  // Expire after 2 minutes
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

  const newUrl = await Url.create({
    originalUrl,
    shortCode,
    expiresAt,
    user: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      url: newUrl,
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    },
  });
});

// Redirect URL
exports.redirectUrl = catchAsync(async (req, res, next) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });

//  console.log("ExpiresAt:", url.expiresAt);
// console.log("Current:", new Date());

// console.log(url.expiresAt.getTime());
// console.log(Date.now());

// console.log(url.expiresAt.getTime() < Date.now());

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    return next(new AppError("This URL has expired", 410));
  }

  url.clicks++;
  await url.save();

  res.redirect(url.originalUrl);
});

// Get My URLs
exports.getAllUrls = catchAsync(async (req, res, next) => {
  const { 
    search,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  const filter = {
    user: req.user.id,
  };

  if (search) {
    filter.$or = [
      {
        originalUrl: {
          $regex: search,
          $options: "i",
        },
      },
      {
        shortCode: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }
  
  // Pagination
  const skip = (page - 1) * limit;
  // Fetch URLs with filter, pagination, and sorting
  const urls = await Url.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

    // Count total URLs for pagination info
  const totalUrls = await Url.countDocuments(filter);

  res.status(200).json({
    status: "success",
    results: urls.length,
    totalResults: totalUrls,
    currentPage: Number(page),
    totalPages: Math.ceil(totalUrls / limit),
    data: {
      urls,
    },
  });
});

// Delete URL
exports.deleteUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const url = await Url.findById(id);

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to delete this URL", 403)
    );
  }

  await url.deleteOne();

  res.status(200).json({
    status: "success",
    message: "URL deleted successfully",
  });
});

// Update URL
exports.updateUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { originalUrl } = req.body;

  const url = await Url.findById(id);

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to update this URL", 403)
    );
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    return next(
      new AppError("This URL has expired. Please create a new one.", 410)
    );
  }

  // Validate updated URL
  try {
    new URL(originalUrl);
  } catch (err) {
    return next(new AppError("Please provide a valid URL", 400));
  }

  url.originalUrl = originalUrl;
  await url.save();

  res.status(200).json({
    status: "success",
    data: {
      url,
    },
  });
});

// URL Analytics
exports.getUrlAnalytics = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const url = await Url.findById(id);

  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to view analytics", 403)
    );
  }

  const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortCode}`;

  const qrCode = await QRCode.toDataURL(shortUrl);

  res.status(200).json({
    status: "success",
    data: {
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      qrCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      expiresAt: url.expiresAt,
    },
  });
});


exports.getDashboardStats = catchAsync(async (req, res, next) => {

  // Total URLs
  const totalUrls = await Url.countDocuments({
    user: req.user.id,
  });

  // Total Clicks
  const totalClicks = await Url.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalClicks: {
          $sum: "$clicks",
        },
      },
    },
  ]);

  // Active URLs
  const activeUrls = await Url.countDocuments({
    user: req.user.id,
    expiresAt: {
      $gt: new Date(),
    },
  });

  // Expired URLs
  const expiredUrls = await Url.countDocuments({
    user: req.user.id,
    expiresAt: {
      $lte: new Date(),
    },
  });

  // Most Clicked URL
  const mostClickedUrl = await Url.findOne({
    user: req.user.id,
  }).sort("-clicks");

  res.status(200).json({
    status: "success",
    data: {
      totalUrls,
      totalClicks: totalClicks[0]?.totalClicks || 0,
      activeUrls,
      expiredUrls,
      mostClickedUrl,
    },
  });

});


exports.topUrls = catchAsync(async (req, res, next) => {
  const topUrls = await Url.find({ user: req.user.id })
    .sort({clicks: -1})
    .limit(5);
     
    res.status(200).json({
      status: "success",
      results: topUrls.length,
      data: {
        topUrls,
      },
    });

});

exports.getRecentUrls = catchAsync(async (req, res, next) => {
  const recentUrls = await Url.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(4);
    
    res.status(200).json({
      status: "success",
      results: recentUrls.length, 
      data: {
        recentUrls,
      },
    });
});


exports.deleteManyUrls = catchAsync(async (req, res, next) => {
  
  const {ids} = req.body;
  // Check if ids array is provided
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(
      new AppError("Please provide an array of URL IDs", 400)
    );
  }

  // Delete URLs that belong to the user
  const result = await Url.deleteMany({
    _id: { $in: ids },
    user: req.user.id,
  });
  console.log(result);

  res.status(200).json({
    status: "success",
    message: `${result.deletedCount} URLs deleted successfully`,
  });
});

exports.restoreUrl = catchAsync(async (req, res, next) => {

  const {id} = req.params;

  const url =await Url.findById(id);

  if(!url){
    return next(new AppError("URL not found", 404));
  }

  if (url.user.toString() !== req.user.id) {
    return next(
      new AppError("You are not allowed to restore this URL", 403)
    );
  }

  if(!url.expiresAt || url.expiresAt > new Date()){
    return next(
      new AppError("This URL is not expired and cannot be restored", 400)
    );
  }

  url.expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await url.save();

// console.log("Restored URL:");
// console.log(url);

  res.status(200).json({
    status: "success",
    message: "URL restored successfully",
  }); 

});

exports.generateQRCode = catchAsync(async (req, res, next) => {

  const { id } = req.params;

  const url = await Url.findById(id);
  
  if (!url) {
    return next(new AppError("URL not found", 404));
  }

  if(url.user.toString() !== req.user.id){
    return next(
      new AppError("You are not allowed to generate QR code for this URL", 403)
    );
  }

  const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortCode}`;

  const qrCode = await QRCode.toDataURL(shortUrl);

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", 
    `attachment; filename=${url.shortCode}-qr.png`
  ); 

  await QRCode.toFileStream(res, shortUrl);

});