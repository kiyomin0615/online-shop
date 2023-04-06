const express = require("express");

const adminController = require("../controllers/admin.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = express.Router();

// 경로에서 "/admin" 생략
router.get("/products", adminController.getProducts);

router.get("/products/new", adminController.getNewProduct);

router.post("/products", imageUploadMiddleware, adminController.createNewProduct); // request의 body를 분석(parse)하기 위해서 반드시 multer 미들웨어 필요

router.get("/products/:id", adminController.getUpdateProduct);

router.post("/products/:id", imageUploadMiddleware, adminController.updateProduct); // request의 body를 분석(parse)하기 위해서 반드시 multer 미들웨어 필요

router.delete("products/:id", adminController.deleteProduct); // Ajax - delete 요청

module.exports = router;