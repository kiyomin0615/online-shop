const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

// 경로에서 "/orders" 생략
router.get("/", ordersController.getOrders);

router.post("/", ordersController.addOrder);

module.exports = router;