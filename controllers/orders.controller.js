const Order = require("../models/order.model");
const User = require("../models/user.model");

function getOrders(req, res) {
  res.render("customer/orders/all-orders");
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findUserById(res.locals.uid);
  } catch (error) {
    next(error);
    return;
  }

  const order = new Order(cart, userDocument);
  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null; // 장바구니 세션 초기화

  res.redirect("/orders"); // 주문 페이지로 이동
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder
}