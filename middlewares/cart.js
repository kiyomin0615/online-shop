const Cart = require("../models/cart.model");

// 장바구니 생성
function initializeCart(req, res, next) {
  let cart;

  // 유저가 첫 방문인 경우(장바구니가 없는 경우)
  if (!req.session.cart) {
    cart = new Cart(); // 새로운 장바구니 생성
  // 유저가 첫 방문이 아닌 경우(장바구니가 이미 있는 경우)
  } else {
    cart = new Cart(req.session.cart.items, req.session.cart.totalQuantity, req.session.cart.totalPrice); // 장바구니 갱신
  }

  res.locals.cart = cart; // 장바구니를 유저에게 제공
  next();
}

module.exports = initializeCart;