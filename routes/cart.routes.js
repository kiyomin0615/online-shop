const express = require("express");

const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.post("/items", cartController.addCartItem); // 경로에서 "/cart" 생략

module.exports = router;