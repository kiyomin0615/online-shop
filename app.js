// modules
const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const database = require("./data/database"); // 데이터베이스 연결 및 가져오기 위한 모듈
const sessionConfig = require("./config/session-config");
const addCsrfTokenMiddleware = require("./middlewares/add-csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkUserMiddleware = require("./middlewares/check-user");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");

const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();

// settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// static files and parsing
app.use(express.static("public"));
app.use(express.static("product-data"));
app.use(express.urlencoded({extended: false}));
app.use(express.json()); // JSON 데이터 분석(parse)

// middlewares
app.use(expressSession(sessionConfig())); // 유저 세션 생성
app.use(cartMiddleware); // 유저에게 장바구니 생성해서 제공(by res.locals)
app.use(csrf()); // CSRF 토큰이 없는 유저의 POST 요청 거부
app.use(addCsrfTokenMiddleware); // 유저에게 CSRF 토큰 생성해서 제공(by res.locals)
app.use(checkUserMiddleware); // 유저가 로그인 상태면 로그인 정보 제공(by res.locals)

// routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes);
app.use(protectRoutesMiddleware); // 라우트 보호
app.use("/admin", adminRoutes);
app.use(errorHandlerMiddleware); // 에러를 처리

database.connectToDatabase()
  // 데이터베이스 연결 성공
  .then(function() {
    app.listen(3000);
  })
  // 데이터베이스 연결 실패
  .catch(function(error) {
    console.log("데이터베이스 연결에 실패했습니다!");
    console.log(error);
  })