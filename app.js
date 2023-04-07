const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const database = require("./data/database");
const sessionConfig = require("./config/session-config");
const addCsrfTokenMiddleware = require("./middlewares/add-csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");

const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routs/cart.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"))
app.use(express.urlencoded({extended: false}));
app.use(express.json()); // JSON 데이터 분석(parse)

app.use(expressSession(sessionConfig())); // 세션 생성
app.use(cartMiddleware); // 유저의 장바구니 생성
app.use(csrf()); // CSRF 토큰이 없는 POST 요청은 거부한다
app.use(addCsrfTokenMiddleware); // CSRF 토큰을 전역 변수 res.locals에 저장
app.use(checkAuthMiddleware); // 해당 유저가 로그인 상태인지 아닌지 확인

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use(cartRoutes); // 라우트의 경로에서 "/cart" 생략하기 위해서
app.use(protectRoutesMiddleware); // 라우트 보호
app.use("/admin", adminRoutes); // 라우트의 경로에서 "/admin" 생략하기 위해서

app.use(errorHandlerMiddleware); // 에러가 발생하면 express에 의해서 자동으로 호출된다

database.connectToDatabase()
  // 데이터베이스 연결에 성공
  .then(function() {
    app.listen(3000);
  })
  // 데이터베이스 연결에 실패
  .catch(function(error) {
    console.log("데이터베이스 연결에 실패했습니다!");
    console.log(error);
  })