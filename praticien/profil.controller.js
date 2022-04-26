const express = require("express");
const router = express.Router();
//const homeController = require("../controllers/home");
const uploadService = require("./profil.service");
const uploadMiddleware = require("./profil.middleware");

const verifyToken = require("_middleware/auth");

router.post("/upload", verifyToken.verifyToken, uploadMiddleware.single("file"), uploadService.uploadFiles);
module.exports = router;
