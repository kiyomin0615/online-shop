const User = require("../models/user.model");
const authentication = require("../util/authentication");
const utilAuthentication =  require("../util/authentication")

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

async function login(req, res) {
  // 입력한 정보로 유저 객체 생성
  const user = new User(req.body.email, req.body.password);

  // 1. 데이터베이스에서 해당 이메일의 유저가 회원가입 됐는지 확인
  const existingUser = await user.getUserWithSameEmail();
  // 회원가입 되지 않은 유저라면, 로그인 페이지로 다시 이동
  if (!existingUser) {
    res.redirect("/login")
    return;
  }

  // 2. 비밀번호가 정확한지 확인
  const passwordIsCorrect = await user.comparePassword(existingUser.password);
  // 비밀번호가 정확하지 않다면, 로그인 페이지로 다시 이동
  if (!passwordIsCorrect) {
    res.redirect("/login")
    return;
  }

  // 3. 로그인 성공
  // 유저 세션 생성
  utilAuthentication.createUserSession(req, existingUser, function() {
    res.redirect("/");
  });
}

function logout(req, res) {
  // 유저 세션 제거
  utilAuthentication.destroyUserAuthSession(req);
  res.redirect("/");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout
}