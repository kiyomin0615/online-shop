const User = require("../models/user.model");

function getSignup(req, res) {
  // 회원가입 페이지
  res.render("customer/auth/signup"); // views/customer/auth/signup.ejs
}

async function signup(req, res) {
  // 입력한 정보로 유저 객체 생성
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.city,
    req.body.street,
    req.body.postal
  );

  // 데이터베이스에 유저 정보 저장
  await user.signup();

  // 회원가입 끝나면 로그인 라우트로 이동
  res.redirect("/login");
}

function getLogin(req, res) {
  // 로그인 페이지
  res.render("customer/auth/login"); // views/customer/auth/signup.ejs
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup
}