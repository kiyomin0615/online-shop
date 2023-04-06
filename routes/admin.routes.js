const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

router.get("/products", adminController.getProducts); // 경로에서 "/admin" 생략

router.get("/products/new", adminController.getNewProduct);

router.post("/products", imageUploadMiddleware, adminController.createNewProduct);

module.exports = router;