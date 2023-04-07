const express = require("express");

const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", cartController.getCart); // 경로에서 "/cart" 생략

router.post("/items", cartController.addCartItem);

router.patch("/items", cartController.updateCartItem); // patch 요청 = 일부 변경

module.exports = router;