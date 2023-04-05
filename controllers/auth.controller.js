const User = require("../models/user.model");
const authentication = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  // 세션 데이터가 없다면(처음 페이지에 접속한 것이라면)
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      city: "",
      street: "",
      postal: ""
    }
  }

  res.render("customer/auth/signup", {sessionData: sessionData}); // 회원가입 페이지 + 세션 데이터
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    city: req.body.city,
    street: req.body.street,
    postal: req.body.postal
  }

  // 입력한 정보가 유효하지 않으면, 회원가입 페이지로 다시 이동
  if (
    !validation.userDetailsAreValid(req.body.email, req.body.password, req.body.fullname, req.body.city, req.body.street, req.body.postal) ||
    !validation.emailIsConfirmed(re.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: "입력한 정보가 유효하지 않습니다. 다시 한번 확인해주세요.",
      ...enteredData
    }, function() {
      res.redirect("/signup");
    });
    return;
  }

  // 입력한 정보로 유저 객체 생성
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.city,
    req.body.street,
    req.body.postal
  );

  // 비동기 에러 처리
  try {
    // 해당 이메일의 유저가 이미 회원가입 했다면, 회원가입 페이지로 다시 이동
    if (await user.existsAlready()) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: "해당 이메일을 가진 유저가 이미 존재합니다.",
        ...enteredData
      }, function() {
        res.redirect("/signup");
      })
      return;
    }
    await user.signup(); // 데이터베이스에 유저 정보 저장
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login"); // 회원가입 끝나면 로그인 라우트로 이동
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  // 세션 데이터가 없다면(처음 페이지에 접속한 것이라면)
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    }
  }

  res.render("customer/auth/login", {sessionData: sessionData}); // 로그인 페이지 + 세션 데이터
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password); // 입력한 정보로 유저 객체 생성

  let existingUser;

  // 비동기 에러 처리
  try {
    existingUser = await user.getUserWithSameEmail(); // 데이터베이스에서 해당 이메일의 유저를 가져오기
  } catch (error) {
    next(error);
    return;
  }

  // 회원가입 되지 않은 유저라면, 로그인 페이지로 다시 이동
  if (!existingUser) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: "입력한 정보가 유효하지 않습니다. 다시 한번 시도해주세요.",
      email: user.email,
      password: user.password
    }, function() {
      res.redirect("/login");
    })
    return;
  }

  // 비밀번호가 정확한지 확인
  const passwordIsCorrect = await user.comparePassword(existingUser.password);
  // 비밀번호가 정확하지 않다면, 로그인 페이지로 다시 이동
  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: "입력한 정보가 유효하지 않습니다. 다시 한번 시도해주세요.",
      email: user.email,
      password: user.password
    }, function() {
      res.redirect("/login");
    })
    return;
  }

  // 로그인 성공
  // 유저 세션 생성
  authentication.createUserSession(req, existingUser, function() {
    res.redirect("/");
  });
}

function logout(req, res) {
  // 유저 세션 제거
  authentication.destroyUserSession(req);
  res.redirect("/");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout
}