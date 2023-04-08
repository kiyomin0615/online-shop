const express = require("express");

const cartController = require("../controllers/cart.controller");

const router = express.Router();

// 경로에서 "/cart" 생략
router.get("/", cartController.getCart);

router.post("/items", cartController.addCartItem); // Ajax - POST 요청

router.patch("/items", cartController.updateCartItem); // Ajax - PATCH 요청

module.exports = router;