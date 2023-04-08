const User = require("../models/user.model");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  // 세션 데이터가 없다면(처음 회원가입 페이지에 접속했으면)
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

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  // 세션 데이터가 없다면(처음 로그인 페이지에 접속했으면)
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    }
  }

  res.render("customer/auth/login", {sessionData: sessionData}); // 로그인 페이지 + 세션 데이터
}

async function signup(req, res, next) {
  // 입력 데이터
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    city: req.body.city,
    street: req.body.street,
    postal: req.body.postal
  }

  // 입력 데이터가 유효하지 않으면, 회원가입 페이지로 다시 이동
  if (
    !validation.userDetailsAreValid(req.body.email, req.body.password, req.body.fullname, req.body.city, req.body.street, req.body.postal) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(req, {
      errorMessage: "입력한 데이터가 유효하지 않습니다. 다시 한번 확인해주세요.",
      ...enteredData
    }, function() {
      res.redirect("/signup"); // 회원가입 페이지로 다시 이동
    });

    return;
  }

  // 입력 데이터가 유효하다면, 입력 데이터로 유저 객체 생성
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.city,
    req.body.street,
    req.body.postal
  );

  try {
    // 이미 해당 이메일로 회원가입이 끝난 상태라면, 회원가입 페이지로 다시 이동
    if (await user.existsAlready()) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: "해당 이메일을 가진 유저가 이미 존재합니다.",
        ...enteredData
      }, function() {
        res.redirect("/signup"); // 회원가입 페이지로 다시 이동
      });

      return;
    }

    await user.signup(); // 회원가입
  }
  catch (error) {
    next(error);
    return;
  }

  res.redirect("/login"); // 회원가입 완료되면 로그인 페이지로 이동
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password); // 입력 데이터로 유저 객체 생성
  
  try {
    // 회원가입이 되지 않은 유저라면, 로그인 페이지로 다시 이동
    if (await user.existsAlready() === false) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: "존재하지 않는 회원입니다. 다시 확인해주세요.",
        email: user.email,
        password: user.password
      }, function() {
        res.redirect("/login"); // 로그인 페이지로 다시 이동
      });

      return;
    }
  } catch (error) {
    next(error);
    return;
  }

  let existingUser;
  try {
    // 비밀번호 비교
    existingUser = await user.getUserWithThisEmail();
    const passwordIsCorrect = await user.comparePassword(existingUser.password);

    // 비밀번호가 정확하지 않다면, 로그인 페이지로 다시 이동
    if (!passwordIsCorrect) {
      sessionFlash.flashDataToSession(req, {
        errorMessage: "입력한 정보가 유효하지 않습니다. 다시 한번 시도해주세요.",
        email: user.email,
        password: user.password
      }, function() {
        res.redirect("/login"); // 로그인 페이지로 다시 이동
      });

      return;
    }
  }
  catch (error) {
    next(error);
    return;
  }

  // 로그인
  req.session.uid = existingUser._id.toString(); // 유저 ID
  req.session.isAuth = true; // 로그인 정보
  req.session.isAdmin = existingUser.isAdmin; // 관리자 정보
  req.session.save(function() {
    res.redirect("/"); // 세션 저장이 끝나면 메인 페이지로 이동
  });
}

function logout(req, res) {
  // 로그아웃
  req.session.uid = null; // 유저 ID
  req.session.isAuth = false; // 로그인 정보
  req.session.isAdmin = false; // 관리자 정보
  res.redirect("/"); // 메인 페이지로 이동
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout
}