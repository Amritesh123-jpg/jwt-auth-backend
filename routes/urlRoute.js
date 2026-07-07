const express = require('express');
const urlController = require('../controller/urlController');
const authController = require('../controller/authController');
/*---- Define routes for URL shortening --*/
const router = express.Router();

router.post("/shorten", authController.protect, urlController.createShortUrl);

router.get("/getMyUrls", authController.protect, urlController.getAllUrls);

router.get("/dashboard", authController.protect, urlController.getDashboardStats);

router.get("/analytics/:id", authController.protect, urlController.getUrlAnalytics);

router.get("/topUrls", authController.protect, urlController.topUrls);

router.delete("/deleteMany", authController.protect, urlController.deleteManyUrls);

router.get("/", authController.protect, urlController.getRecentUrls);

router.patch("/restore/:id", authController.protect, urlController.restoreUrl);

router.get("/qr/:id", authController.protect, urlController.generateQRCode);

router.patch("/:id", authController.protect, urlController.updateUrl);

router.delete("/:id", authController.protect, urlController.deleteUrl);




// Always keep this at the end
router.get("/:shortCode", urlController.redirectUrl);

 

module.exports = router;

